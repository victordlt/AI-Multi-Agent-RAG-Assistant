"""Agente de razonamiento: sintetiza la evidencia recuperada y redacta la respuesta.

Utiliza el núcleo de LangChain (`langchain_core.messages` + `BaseChatModel`).
"""

from typing import List

from langchain_core.messages import HumanMessage, SystemMessage

from app.core.llm import get_llm
from app.core.logging import get_logger
from app.models.chunk import DocumentChunk
from app.utils.security import sanitize_for_prompt

logger = get_logger(__name__)

REASONER_SYSTEM = """Eres un asistente preciso. Tu tarea es responder a la pregunta del usuario utilizando ÚNICAMENTE el contexto proporcionado en los documentos cargados.
- Tus respuestas deben ser en español.
- Basas tu respuesta estrictamente en el contexto recuperado. No añadas conocimientos externos.
- Incluye citas en el texto (p. ej., "Según [nombre del archivo, página X]...").
- Si el contexto no permite dar una respuesta, indica: "No encontré suficiente evidencia en los documentos cargados para responder a esto con certeza".
- Sé conciso y objetivo."""


class ReasonerAgent:
    """Sintetiza fragmentos en una respuesta fundamentada utilizando un LangChain BaseChatModel."""

    def synthesize(
        self,
        question: str,
        chunks: List[tuple[DocumentChunk, float]],
    ) -> str:
        """Genera una respuesta a partir de la pregunta y los chunks recuperados."""
        if not chunks:
            return "No pude encontrar pruebas suficientes en los documentos cargados para responder a esto con certeza."
        context_parts = []
        for i, (chunk, _) in enumerate(chunks, 1):
            safe = sanitize_for_prompt(chunk.content, max_length=8000)
            ref = f"{chunk.metadata.file_name}"
            if chunk.metadata.page is not None:
                ref += f", page {chunk.metadata.page}"
            if chunk.metadata.sheet_name:
                ref += f', sheet "{chunk.metadata.sheet_name}"'
            context_parts.append(f"[{i}] ({ref})\n{safe}")
        context = "\n\n---\n\n".join(context_parts)
        user_content = (
            f"Context:\n\n{context}\n\n---\n\nQuestion: {question}\n\n"
            "Answer (cite sources from context):"
        )
        llm = get_llm()
        if not llm:
            return "El servicio de respuesta no está disponible temporalmente. Por favor, verifique la configuración."
        messages = [
            SystemMessage(content=REASONER_SYSTEM),
            HumanMessage(content=user_content),
        ]
        try:
            msg = llm.invoke(messages)
            return msg.content if hasattr(msg, "content") else str(msg)
        except Exception as e:
            logger.exception("reasoner_llm_error", error=str(e))
            return "Se ha producido un error al generar la respuesta. Por favor, inténtalo de nuevo."
