import os
from functools import lru_cache

PROMPTS_DIR = os.path.dirname(os.path.abspath(__file__))


@lru_cache(maxsize=16)
def load_prompt(prompt_name: str) -> str:
    """Loads a markdown system prompt from the backend/app/prompts directory.

    Args:
        prompt_name: filename with or without .md extension (e.g. 'pi_coordinator' or 'pi_coordinator.md')
    """
    if not prompt_name.endswith(".md"):
        prompt_name = f"{prompt_name}.md"

    file_path = os.path.join(PROMPTS_DIR, prompt_name)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read().strip()

    return f"System prompt for {prompt_name} (default fallback)."
