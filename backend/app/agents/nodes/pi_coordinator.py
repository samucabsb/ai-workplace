import logging
from typing import Dict, Any
from app.agents.state import LabGraphState, PicoFramework
from app.prompts import load_prompt

logger = logging.getLogger("cortexlab.agents.coordinator")


async def pi_coordinator_node(state: LabGraphState) -> Dict[str, Any]:
    """PI Coordinator Agent: Deconstructs research question into PICO and Boolean strategies."""
    topic = state.get("query") or state.get("topic") or "Biomedical Systematic Review"
    prompt = load_prompt("pi_coordinator")
    logger.info(f"[PI Coordinator] Formulating protocol for: {topic} (prompt size: {len(prompt)})")

    # Structure PICO framework based on research topic
    topic_keywords = topic.replace(",", " ").split()
    primary_subject = topic_keywords[0] if topic_keywords else "Target Condition"
    intervention_subject = topic_keywords[1] if len(topic_keywords) > 1 else topic

    pico: PicoFramework = {
        "population": f"Adult subjects or in-vitro/in-vivo models with {primary_subject}",
        "intervention": f"Experimental protocol or agent related to {intervention_subject}",
        "comparator": "Placebo, sham protocol, standard of care or inactive control",
        "outcome": "Primary quantitative efficacy, adverse effects and statistical significance (p < 0.05)",
    }

    # Generate optimized boolean search queries
    boolean_queries = [
        f'("{topic}") AND (randomized controlled trial OR clinical trial OR systematic review OR cohort)',
        (
            f'("{primary_subject}"[Title/Abstract]) AND '
            f'("{intervention_subject}"[Title/Abstract]) AND (control OR placebo)'
        ),
        f'("{topic}") AND (SciELO OR PubMed OR Europe PMC OR OpenAlex)',
    ]

    # Consolidate criteria
    inclusion = state.get("inclusion_criteria") or [
        "Peer-reviewed journal articles or indexed conference papers",
        "Empirical methodology with clear sample size (N >= 10)",
        "Defined experimental intervention and control/comparator group",
        "Published between 2018 and 2026",
    ]

    exclusion = state.get("exclusion_criteria") or [
        "Non-peer-reviewed opinion editorials or non-scientific blogs",
        "Studies lacking control group or missing statistical significance data",
        "Predatory publications without verifiable DOI resolution",
    ]

    current_statuses = dict(state.get("agent_statuses") or {})
    current_statuses["coordinator"] = "COMPLETED"
    current_statuses["miner"] = "WORKING"

    return {
        "pico": pico,
        "boolean_queries": boolean_queries,
        "inclusion_criteria": inclusion,
        "exclusion_criteria": exclusion,
        "active_agent": "coordinator",
        "current_bench": "bench_coordinator",
        "agent_statuses": current_statuses,
        "current_step": "MINING",
        "status_message": f"PI Coordinator estruturou protocolo PICO e 3 queries booleanas para '{topic}'.",
    }
