import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    import pytest
except ImportError:
    pytest = None

from app.services.open_apis import clean_doi
from app.services.pdf_parser import ScientificPDFParser
from app.models.schemas import Paper, RiskOfBiasLevel


def test_clean_doi():
    assert clean_doi("https://doi.org/10.1038/s41586-020-2649-2") == "10.1038/s41586-020-2649-2"
    assert clean_doi("doi:10.1016/j.cell.2021.05.001") == "10.1016/j.cell.2021.05.001"
    assert clean_doi(None) is None


def test_paper_schema():
    p = Paper(
        id="test:1",
        doi="10.1000/182",
        title="Test Scientific Paper",
        authors=["Alice Smith", "Bob Jones"],
        year=2024,
        source_api="OpenAlex",
        doi_verified=True,
    )
    assert p.doi == "10.1000/182"
    assert p.is_screened_in is True
    assert p.authors[0] == "Alice Smith"


def test_scientific_pdf_parser_segmentation():
    sample_pages = [
        "Abstract\nThis study explores human augmentation in bioinformatics.\n\n"
        "Methods\nWe randomized 100 participants into two double-blind groups. P-values were evaluated.",
        "Results\nThe augmented group showed a 65% reduction in screening latency (p < 0.001).\n\n"
        "Limitations\nThe sample size was restricted to academic researchers."
    ]

    segments = ScientificPDFParser.segment_document(sample_pages)
    assert "ABSTRACT" in segments
    assert "METHODS" in segments
    assert "RESULTS" in segments
    assert "LIMITATIONS" in segments
    assert "65% reduction" in segments["RESULTS"]


if __name__ == "__main__":
    test_clean_doi()
    test_scientific_pdf_parser_segmentation()
    print("ALL TESTS PASSED SUCCESSFULLY!")

