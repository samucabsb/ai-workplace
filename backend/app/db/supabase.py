import logging
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("cortexlab.db.supabase")

_supabase_client = None


def get_supabase_client():
    """Returns initialized Supabase client singleton, or None if not configured."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.info("[Supabase] SUPABASE_URL or SUPABASE_KEY not configured. Running in memory-buffered mode.")
        return None

    try:
        from supabase import create_client
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("[Supabase] Successfully connected to PostgreSQL / Supabase backend.")
        return _supabase_client
    except Exception as e:
        logger.warning(f"[Supabase] Could not initialize client: {e}. Falling back to memory mode.")
        return None


def is_supabase_configured() -> bool:
    """Checks whether Supabase credentials are validly provided."""
    return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)


async def save_project(project_data: Dict[str, Any]) -> bool:
    """Persists or updates a systematic review project in Supabase."""
    client = get_supabase_client()
    if not client:
        return False
    try:
        client.table("projects").upsert(project_data).execute()
        return True
    except Exception as e:
        logger.error(f"[Supabase] Failed to persist project: {e}")
        return False


async def save_papers(project_id: str, papers: List[Dict[str, Any]]) -> bool:
    """Persists mined/screened papers linked to a project."""
    client = get_supabase_client()
    if not client or not papers:
        return False
    try:
        records = []
        for p in papers:
            record = {
                "id": f"{project_id}_{p.get('id', p.get('doi', 'paper'))}",
                "project_id": project_id,
                "doi": p.get("doi"),
                "title": p.get("title", ""),
                "authors": p.get("authors", []),
                "year": p.get("year"),
                "journal": p.get("journal"),
                "abstract": p.get("abstract"),
                "source_api": p.get("source_api", "Federated"),
                "is_screened_in": p.get("is_screened_in", True),
                "open_access_pdf_url": p.get("open_access_pdf_url"),
            }
            records.append(record)
        client.table("papers").upsert(records).execute()
        return True
    except Exception as e:
        logger.error(f"[Supabase] Failed to persist papers: {e}")
        return False


async def save_prisma_matrix(project_id: str, matrix_rows: List[Dict[str, Any]]) -> bool:
    """Persists PRISMA systematic review matrix rows."""
    client = get_supabase_client()
    if not client or not matrix_rows:
        return False
    try:
        records = []
        for row in matrix_rows:
            record = {
                "project_id": project_id,
                "paper_id": row.get("paper_id"),
                "citation_key": row.get("citation_key"),
                "doi": row.get("doi"),
                "title": row.get("title"),
                "population_n": row.get("population_n"),
                "intervention": row.get("intervention"),
                "comparator": row.get("comparator"),
                "outcomes": row.get("outcomes"),
                "risk_of_bias": row.get("risk_of_bias"),
                "statistical_soundness": row.get("statistical_soundness"),
                "traceable_quote": row.get("traceable_quote"),
                "page_reference": row.get("page_reference"),
                "qualis_capes": row.get("qualis_capes"),
                "sjr_quartile": row.get("sjr_quartile"),
            }
            records.append(record)
        client.table("prisma_rows").upsert(records).execute()
        return True
    except Exception as e:
        logger.error(f"[Supabase] Failed to persist PRISMA rows: {e}")
        return False


async def log_agent_event(
    project_id: str,
    agent_id: str,
    bench_id: str,
    step: str,
    event_type: str,
    payload: Dict[str, Any]
) -> bool:
    """Logs telemetry of an agent bench action into the persistent database."""
    client = get_supabase_client()
    if not client:
        return False
    try:
        record = {
            "project_id": project_id,
            "agent_id": agent_id,
            "bench_id": bench_id,
            "step": step,
            "event_type": event_type,
            "payload": payload,
        }
        client.table("agent_events").insert(record).execute()
        return True
    except Exception as e:
        logger.error(f"[Supabase] Failed to log agent event: {e}")
        return False
