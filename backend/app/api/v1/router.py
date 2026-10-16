import asyncio
import io
import json
import uuid
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from app.models.schemas import (
    CreateReviewRequest,
    HITLDecisionRequest,
)
from app.agents.graph import (
    build_cortex_graph,
    CortexWorkflowState,
)

router = APIRouter(prefix="/v1", tags=["CortexLab Core"])

# In-memory store for active research reviews (backed by Supabase in production)
REVIEWS_DATABASE: Dict[str, CortexWorkflowState] = {}


@router.post("/reviews", summary="Inicia nova revisão sistemática com agentes")
async def create_review(payload: CreateReviewRequest):
    review_id = str(uuid.uuid4())[:8]

    initial_state: CortexWorkflowState = {
        "review_id": review_id,
        "query": payload.topic,
        "inclusion_criteria": payload.inclusion_criteria,
        "exclusion_criteria": payload.exclusion_criteria,
        "raw_papers": [],
        "screened_papers": [],
        "audited_papers": [],
        "prisma_matrix": [],
        "knowledge_gaps": [],
        "current_step": "MINING",
        "hitl_pending": False,
        "hitl_checkpoint": None,
        "status_message": f"Iniciando busca multi-agente para '{payload.topic}'...",
    }

    REVIEWS_DATABASE[review_id] = initial_state

    # Execute Miner Node
    from app.agents.graph import miner_node
    miner_result = await miner_node(initial_state)
    initial_state.update(miner_result)
    REVIEWS_DATABASE[review_id] = initial_state

    return {
        "review_id": review_id,
        "status": initial_state["current_step"],
        "hitl_pending": initial_state["hitl_pending"],
        "hitl_checkpoint": initial_state["hitl_checkpoint"],
        "message": initial_state["status_message"],
        "papers_found": len(initial_state["raw_papers"]),
        "papers": initial_state["raw_papers"],
    }


@router.get("/reviews/{review_id}", summary="Consulta estado completo da revisão")
async def get_review(review_id: str):
    if review_id not in REVIEWS_DATABASE:
        raise HTTPException(status_code=404, detail="Review session not found")
    return REVIEWS_DATABASE[review_id]


@router.post("/reviews/{review_id}/hitl", summary="Validação humana (Human-in-the-Loop)")
async def submit_hitl_decision(review_id: str, decision: HITLDecisionRequest):
    if review_id not in REVIEWS_DATABASE:
        raise HTTPException(status_code=404, detail="Review session not found")

    state = REVIEWS_DATABASE[review_id]

    if decision.step_checkpoint == "screening":
        if decision.rejected_paper_ids:
            for p in state["raw_papers"]:
                if p["id"] in decision.rejected_paper_ids:
                    p["is_screened_in"] = False

        from app.agents.graph import human_screening_node, parser_node, auditor_node
        # 1. Human node
        screened_res = human_screening_node(state)
        state.update(screened_res)

        # 2. Parser node
        parser_res = await parser_node(state)
        state.update(parser_res)

        # 3. Auditor node
        auditor_res = await auditor_node(state)
        state.update(auditor_res)

        # If auditor requires bias arbitration, stop here
        if not state.get("hitl_pending"):
            from app.agents.graph import synthesizer_node
            synth_res = await synthesizer_node(state)
            state.update(synth_res)

        REVIEWS_DATABASE[review_id] = state
        return {
            "review_id": review_id,
            "status": state["current_step"],
            "hitl_pending": state["hitl_pending"],
            "hitl_checkpoint": state.get("hitl_checkpoint"),
            "message": state["status_message"],
            "matrix_rows": len(state.get("prisma_matrix", [])),
        }

    elif decision.step_checkpoint == "bias_arbitration":
        from app.agents.graph import human_bias_node, synthesizer_node
        bias_res = human_bias_node(state)
        state.update(bias_res)

        synth_res = await synthesizer_node(state)
        state.update(synth_res)

        REVIEWS_DATABASE[review_id] = state
        return {
            "review_id": review_id,
            "status": state["current_step"],
            "hitl_pending": False,
            "message": state["status_message"],
            "matrix_rows": len(state.get("prisma_matrix", [])),
            "knowledge_gaps": state.get("knowledge_gaps", []),
        }

    raise HTTPException(status_code=400, detail="Invalid checkpoint step")


@router.get("/reviews/{review_id}/events", summary="Stream SSE de telemetria dos agentes")
async def stream_review_events(review_id: str):
    """Server-Sent Events endpoint streaming real-time status of agent benches."""
    async def event_generator():
        for i in range(15):
            await asyncio.sleep(2)
            state = REVIEWS_DATABASE.get(review_id, {})
            current_step = state.get("current_step", "MINING")

            payload = {
                "review_id": review_id,
                "step": current_step,
                "hitl_pending": state.get("hitl_pending", False),
                "papers_count": len(state.get("raw_papers", [])),
                "message": state.get("status_message", "Agentes processando em bancadas..."),
            }
            yield f"data: {json.dumps(payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/reviews/{review_id}/export/csv", summary="Exporta Matriz PRISMA em CSV")
async def export_prisma_csv(review_id: str):
    if review_id not in REVIEWS_DATABASE:
        raise HTTPException(status_code=404, detail="Review session not found")

    state = REVIEWS_DATABASE[review_id]
    matrix = state.get("prisma_matrix", [])

    output = io.StringIO()
    output.write("CitationKey,DOI,Title,Authors,Year,SampleN,Intervention,Outcomes,RiskOfBias,TraceableQuote\n")

    for row in matrix:
        authors_str = "; ".join(row.get("authors", []))
        line = f'"{row.get("citation_key")}","{row.get("doi")}","{row.get("title")}","{authors_str}",{row.get("year")},"{row.get("population_n")}","{row.get("intervention")}","{row.get("outcomes")}","{row.get("risk_of_bias")}","{row.get("traceable_quote")}"\n'
        output.write(line)

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=prisma_matrix_{review_id}.csv"},
    )


@router.get("/reviews/{review_id}/export/bibtex", summary="Exporta Citações em BibTeX")
async def export_bibtex(review_id: str):
    if review_id not in REVIEWS_DATABASE:
        raise HTTPException(status_code=404, detail="Review session not found")

    state = REVIEWS_DATABASE[review_id]
    matrix = state.get("prisma_matrix", [])

    bib_entries = []
    for row in matrix:
        cite_key = row.get("citation_key", "Study2024")
        authors_str = " and ".join(row.get("authors", ["Anonymous"]))
        entry = (
            f"@article{{{cite_key},\n"
            f"  title = {{{row.get('title')}}},\n"
            f"  author = {{{authors_str}}},\n"
            f"  year = {{{row.get('year')}}},\n"
            f"  doi = {{{row.get('doi')}}},\n"
            f"  journal = {{{row.get('journal', 'Academic Press')}}}\n"
            f"}}"
        )
        bib_entries.append(entry)

    bib_content = "\n\n".join(bib_entries)
    return Response(
        content=bib_content,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=references_{review_id}.bib"},
    )
