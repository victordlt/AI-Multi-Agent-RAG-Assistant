"""Agente Validador: Verificar la respuesta con las fuentes, riesgo de alucinación, citas."""

from dataclasses import dataclass
from typing import List, Optional

from app.core.logging import get_logger
from app.models.chunk import DocumentChunk
from app.schemas.query import SupportStatus

logger = get_logger(__name__)


@dataclass
class ValidationResult:
    """Resultado de validación estructurado."""

    passed: bool
    support_status: SupportStatus
    summary: str
    issues: List[str]


class ValidatorAgent:
    """Valida que la respuesta esté respaldada por los fragmentos recuperados y cuente con citas."""

    def validate(
        self,
        answer: str,
        chunks: List[tuple[DocumentChunk, float]],
        question: str,
    ) -> ValidationResult:
        """Verifica la fundamentación de la respuesta y la presencia de citas."""
        issues: List[str] = []
        if not answer or not answer.strip():
            return ValidationResult(
                passed=False,
                support_status=SupportStatus.INSUFFICIENT,
                summary="Respuesta vacía.",
                issues=["Respuesta vacía."],
            )
        if not chunks:
            return ValidationResult(
                passed=False,
                support_status=SupportStatus.INSUFFICIENT,
                summary="No hay fuentes con las que realizar la validación.",
                issues=["No se recuperaron chunks"],
            )
        
        # Heurística: la respuesta debe hacer referencia a al menos una fuente (nombre de archivo o «documento»).
        chunk_files = {c.metadata.file_name for c, _ in chunks}
        refs_found = sum(1 for f in chunk_files if f in answer)
        if refs_found == 0 and "document" not in answer.lower() and "uploaded" not in answer.lower():
            issues.append("La respuesta no puede citar documentos cargados.")
        # Insufficient evidence phrase is acceptable
        if "no se pudo encontrar suficiente evidencia" in answer.lower():
            return ValidationResult(
                passed=True,
                support_status=SupportStatus.INSUFFICIENT,
                summary="La respuesta indica correctamente que no hay pruebas suficientes.",
                issues=[],
            )
        if issues:
            return ValidationResult(
                passed=refs_found > 0,
                support_status=SupportStatus.PARTIAL if refs_found > 0 else SupportStatus.INSUFFICIENT,
                summary="Validación completada con reservas.",
                issues=issues,
            )
        return ValidationResult(
            passed=True,
            support_status=SupportStatus.SUPPORTED,
            summary="La respuesta parece fundamentarse en las fuentes recuperadas, incluyendo las citas correspondientes.",
            issues=[],
        )
