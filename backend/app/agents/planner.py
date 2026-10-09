"""Agente planificador: interpretar la pregunta, decidir si es necesaria la recuperación de información y planificar los pasos."""

from dataclasses import dataclass
from typing import Optional

from app.core.logging import get_logger
from app.utils.security import is_safe_query

logger = get_logger(__name__)


@dataclass
class Plan:
    """Salida estructurada del planificador."""

    needs_retrieval: bool
    planned_query: str
    reasoning_summary: str
    error: Optional[str] = None


class PlannerAgent:
    """Interpreta la pregunta del usuario y decide la estrategia retrieval"""

    def plan(self, question: str) -> Plan:
        """Produce a plan for answering the question."""
        safe, err = is_safe_query(question)
        if not safe:
            return Plan(
                needs_retrieval=False,
                planned_query=question,
                reasoning_summary="Consulta rechazada por la comprobación de seguridad.",
                error=err,
            )
        # Siempre hacemos retrival para preguntas de documentos, ya que necesitamos buscar en los chunks relevantes.
        normalized = question.strip()
        return Plan(
            needs_retrieval=True,
            planned_query=normalized,
            reasoning_summary="Documento: recuperará fragmentos relevantes y generará una respuesta fundamentada.",
        )
