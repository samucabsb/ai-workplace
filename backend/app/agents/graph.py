import logging
from langgraph.graph import StateGraph, END
from app.agents.state import LabGraphState
from app.agents.nodes.pi_coordinator import pi_coordinator_node
from app.agents.nodes.miner_node import miner_node, human_screening_node
from app.agents.nodes.methodologist_node import methodologist_node, human_bias_node
from app.agents.nodes.synthesizer_node import synthesizer_node

logger = logging.getLogger("cortexlab.graph")


def route_after_miner(state: LabGraphState) -> str:
    """Routes to human screening if checkpoint pending, else straight to methodologist."""
    if state.get("hitl_pending") and state.get("hitl_checkpoint") == "screening":
        return "human_screening_node"
    return "methodologist_node"


def route_after_auditor(state: LabGraphState) -> str:
    """Routes to human bias arbitration if high-risk bias detected, else straight to synthesis."""
    if state.get("hitl_pending") and state.get("hitl_checkpoint") == "bias_arbitration":
        return "human_bias_node"
    return "synthesizer_node"


def build_cortex_graph():
    """Builds and compiles the modular multi-agent LangGraph workflow for CortexLab."""
    workflow = StateGraph(LabGraphState)

    # Register individual agent workstations
    workflow.add_node("pi_coordinator_node", pi_coordinator_node)
    workflow.add_node("miner_node", miner_node)
    workflow.add_node("human_screening_node", human_screening_node)
    workflow.add_node("methodologist_node", methodologist_node)
    workflow.add_node("human_bias_node", human_bias_node)
    workflow.add_node("synthesizer_node", synthesizer_node)

    # Workflow entry point: PI Coordinator
    workflow.set_entry_point("pi_coordinator_node")
    workflow.add_edge("pi_coordinator_node", "miner_node")

    # Conditional checkpoint after mining
    workflow.add_conditional_edges(
        "miner_node",
        route_after_miner,
        {
            "human_screening_node": "human_screening_node",
            "methodologist_node": "methodologist_node",
        },
    )

    workflow.add_edge("human_screening_node", "methodologist_node")

    # Conditional checkpoint after methodologist audit
    workflow.add_conditional_edges(
        "methodologist_node",
        route_after_auditor,
        {
            "human_bias_node": "human_bias_node",
            "synthesizer_node": "synthesizer_node",
        },
    )

    workflow.add_edge("human_bias_node", "synthesizer_node")
    workflow.add_edge("synthesizer_node", END)

    return workflow.compile()


# Compatibility aliases for existing imports in router and tests
auditor_node = methodologist_node
parser_node = methodologist_node
