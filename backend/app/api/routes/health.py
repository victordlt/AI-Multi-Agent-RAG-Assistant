"""Endpoint de Health-check."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    """Verificación de actividad/disponibilidad."""
    return {"status": "ok", "service": "Agente IA Profesional"}
