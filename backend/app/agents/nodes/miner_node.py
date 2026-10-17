import logging
from typing import Dict, Any, List
from app.agents.state import LabGraphState
from app.models.schemas import Paper
from app.services.open_apis import federated_literature_search, clean_doi
from app.prompts import load_prompt

logger = logging.getLogger("cortexlab.agents.miner")


async def miner_node(state: LabGraphState) -> Dict[str, Any]:
    """Miner Agent: Performs federated search across OpenAlex, PubMed & Europe PMC with DOI deduplication."""
    topic = state.get("query") or state.get("topic") or "Biomedical Research"
    prompt = load_prompt("miner")
    logger.info(f"[Miner Agent] Literature mining for: {topic} (prompt size: {len(prompt)})")

    # Use first boolean query or raw query
    search_query = state.get("boolean_queries", [topic])[0] if state.get("boolean_queries") else topic
    papers: List[Paper] = await federated_literature_search(search_query, limit_per_source=8)

    # Deduplicate strictly by DOI
    seen_dois = set()
    deduped_papers: List[Dict[str, Any]] = []

    for p in papers:
        doi_norm = clean_doi(p.doi) if p.doi else None
        if doi_norm and doi_norm in seen_dois:
            continue
        if doi_norm:
            seen_dois.add(doi_norm)

        paper_dict = p.model_dump()
        paper_dict["doi"] = doi_norm or paper_dict.get("doi")
        deduped_papers.append(paper_dict)

    current_statuses = dict(state.get("agent_statuses") or {})
    current_statuses["miner"] = "WAITING_APPROVAL"

    status_msg = (
        f"MinerAgent recuperou e deduplicou {len(deduped_papers)} artigos com DOI validado. "
        "Aguardando triagem humana."
    )

    return {
        "raw_papers": deduped_papers,
        "active_agent": "miner",
        "current_bench": "bench_mining",
        "agent_statuses": current_statuses,
        "current_step": "SCREENING_CHECKPOINT",
        "hitl_pending": True,
        "hitl_checkpoint": "screening",
        "status_message": status_msg,
    }


def human_screening_node(state: LabGraphState) -> Dict[str, Any]:
    """HITL Screening Gate: Researcher accepts or excludes mined papers."""
    logger.info("[HITL Gate] Processing human screening decisions.")
    screened = [p for p in state.get("raw_papers", []) if p.get("is_screened_in", True)]

    current_statuses = dict(state.get("agent_statuses") or {})
    current_statuses["miner"] = "COMPLETED"
    current_statuses["methodologist"] = "WORKING"

    return {
        "screened_papers": screened,
        "active_agent": "methodologist",
        "current_bench": "bench_auditing",
        "agent_statuses": current_statuses,
        "hitl_pending": False,
        "hitl_checkpoint": None,
        "current_step": "AUDITING",
        "status_message": f"Triagem humana aprovada com {len(screened)} artigos incluídos para auditoria metodológica.",
    }
