import hashlib
import re
from typing import Dict, List, Tuple
from app.models.schemas import ParagraphEvidence

SECTION_PATTERNS = {
    "ABSTRACT": r"^(?:abstract|resumo)\b",
    "METHODS": r"^(?:materials?\s+and\s+methods?|methodology|methods|experimental\s+procedures?|métodos)\b",
    "RESULTS": r"^(?:results?|findings|resultados)\b",
    "DISCUSSION": r"^(?:discussion|discussão)\b",
    "LIMITATIONS": r"^(?:limitations?|study\s+limitations?|limitações)\b",
    "CONCLUSION": r"^(?:conclusions?|concluding\s+remarks?|conclusão)\b",
}


class ScientificPDFParser:
    """Extracts text from academic PDFs, preserving page numbers, section boundaries, and paragraph hashes."""

    @staticmethod
    def extract_paragraphs_from_text(pages_text: List[str]) -> List[ParagraphEvidence]:
        """Splits full document into traceable paragraph evidence items."""
        evidence_list: List[ParagraphEvidence] = []
        current_section = "INTRODUCTION"

        for page_idx, page_str in enumerate(pages_text, start=1):
            paragraphs = [p.strip() for p in page_str.split("\n\n") if len(p.strip()) > 40]

            for p_idx, text in enumerate(paragraphs):
                # Detect section header change
                first_line = text.split("\n")[0].strip().lower()
                for sec_name, pattern in SECTION_PATTERNS.items():
                    if re.search(pattern, first_line):
                        current_section = sec_name
                        break

                p_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]
                evidence_list.append(
                    ParagraphEvidence(
                        section_name=current_section,
                        page_number=page_idx,
                        paragraph_index=p_idx,
                        text_quote=text,
                        content_hash=p_hash,
                    )
                )

        return evidence_list

    @classmethod
    def segment_document(cls, pages_text: List[str]) -> Dict[str, str]:
        """Aggregates paragraphs by section for agent consumption."""
        evidence = cls.extract_paragraphs_from_text(pages_text)
        sections_map: Dict[str, List[str]] = {}

        for item in evidence:
            sections_map.setdefault(item.section_name, []).append(item.text_quote)

        return {sec: "\n\n".join(texts) for sec, texts in sections_map.items()}
