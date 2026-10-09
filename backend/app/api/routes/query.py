"""API de consultas: RAG estándar y consultas basadas en agentes."""

from fastapi import APIRouter, HTTPException

from app.schemas.query import AgentQueryRequest, AgentQueryResponse, QueryRequest, QueryResponse
from app.rag.pipeline import get_rag_service
from app.agents.orchestrator import get_agent_orchestrator

router = APIRouter(tags=["query"])


@router.post("/query", response_model=QueryResponse)
def query(request: QueryRequest):
    """Pipeline RAG estándar: recuperar los *k* chunks principales y generar una respuesta."""
    rag = get_rag_service()
    return rag.query(request.question)


@router.post("/agents/query", response_model=AgentQueryResponse)
def agents_query(request: AgentQueryRequest):
    """Consulta basada en agentes: planificador -> recuperador -> razonador -> validador con resumen de ejecución."""
    orchestrator = get_agent_orchestrator()
    return orchestrator.query(QueryRequest(question=request.question))
