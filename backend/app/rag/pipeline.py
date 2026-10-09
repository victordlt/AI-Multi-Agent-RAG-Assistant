"""RAG pipeline: retrieve -> build prompt -> generar una respuesta fundamentada con citas.

Utilice el núcleo de LangChain (`langchain_core.messages` + `BaseChatModel`) y la Factory de LLM compartida, de modo que la canalización no quede acoplada..
"""

from typing import Optional

from langchain_core.messages import HumanMessage, SystemMessage

from app.core.config import get_settings
from app.core.llm import get_llm
from app.core.logging import get_logger
from app.schemas.query import (
    Citation,
    QueryResponse,
    RetrievedChunk,
    SupportStatus,
)
from app.services.vector_store import get_vector_store
from app.utils.security import sanitize_for_prompt, is_safe_query
from app.models.chunk import DocumentChunk

logger = get_logger(__name__)

SYSTEM_PROMPT = """Eres un asistente servicial que responde preguntas basándose ÚNICAMENTE en el contexto proporcionado por los documentos cargados..
Reglas:
- Responde solo en español.
- Si el docuemnto esta en inglés debes traducirlo al español.
- Responde utilizando únicamente el contexto recuperado que aparece a continuación. No utilices conocimientos externos.
- Si el contexto no contiene información suficiente para responder, indica: "No encontré pruebas suficientes en los documentos cargados para responder a esto con certeza".
- Incluye citas breves en tu respuesta (p. ej., "Según [nombre del documento, página/hoja X]...").
- Sé conciso y preciso. No inventes ni asumas información.
- Si la pregunta del usuario se desvía del tema o es perjudicial, declina amablemente."""


class RAGService:
    """Retrieve relevant chunks, build prompt, call LLM, return respuesta con citas."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.vector_store = get_vector_store()

    def query(
        self,
        question: str,
        top_k: Optional[int] = None,
    ) -> QueryResponse:
        """Run RAG: retrieve -> prompt -> generate."""
        safe, err = is_safe_query(question)
        if not safe:
            return QueryResponse(
                question=question,
                answer="No puedo procesar este requerimiento. " + (err or "Invalid query."),
                support_status=SupportStatus.INSUFFICIENT,
            )
        chunks_with_scores = self.vector_store.search(question, top_k=top_k)
        if not chunks_with_scores:
            return QueryResponse(
                question=question,
                answer="No he podido encontrar pruebas suficientes en los documentos cargados para responder a esto con seguridad. Por favor, cargue primero los documentos pertinentes.",
                retrieved_chunks=[],
                support_status=SupportStatus.INSUFFICIENT,
            )
        chunks = [c for c, _ in chunks_with_scores]
        scores = [s for _, s in chunks_with_scores]
        context_blocks = []
        for i, (chunk, score) in enumerate(chunks_with_scores):
            safe_text = sanitize_for_prompt(chunk.content, max_length=8000)
            ref = _chunk_ref(chunk)
            context_blocks.append(f"[Source {i+1} - {ref}]\n{safe_text}")
        context = "\n\n---\n\n".join(context_blocks)
        user_content = (
            f"Context from uploaded documents:\n\n{context}\n\n---\n\n"
            f"Question: {question}\n\nAnswer (use only the context above; cite sources):"
        )
        llm = get_llm()
        if not llm:
            return QueryResponse(
                question=question,
                answer="El servicio de respuestas no está disponible temporalmente. Por favor, verifique la configuracion del llm.",
                retrieved_chunks=_to_retrieved_chunks(chunks, scores),
                support_status=SupportStatus.INSUFFICIENT,
            )
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_content),
        ]
        try:
            message = llm.invoke(messages)
            answer_text = message.content if hasattr(message, "content") else str(message)
        except Exception as e:
            logger.exception("rag_llm_error", error=str(e))
            return QueryResponse(
                question=question,
                answer="Un error ha ocurrido generando la respuesta. Por favor intenta de nuevo.",
                retrieved_chunks=_to_retrieved_chunks(chunks, scores),
                support_status=SupportStatus.INSUFFICIENT,
            )
        citations = _build_citations(chunks)
        return QueryResponse(
            question=question,
            answer=answer_text,
            citations=citations,
            retrieved_chunks=_to_retrieved_chunks(chunks, scores),
            support_status=SupportStatus.SUPPORTED if chunks else SupportStatus.PARTIAL,
        )


def _chunk_ref(chunk: DocumentChunk) -> str:
    m = chunk.metadata
    parts = [m.file_name]
    if m.page is not None:
        parts.append(f"page {m.page}")
    if m.sheet_name:
        parts.append(f'sheet "{m.sheet_name}"')
    if m.row_start is not None and m.row_end is not None:
        parts.append(f"rows {m.row_start}-{m.row_end}")
    return ", ".join(parts)


def _build_citations(chunks: list[DocumentChunk]) -> list[Citation]:
    seen = set()
    citations = []
    for c in chunks:
        ref = _chunk_ref(c)
        if ref in seen:
            continue
        seen.add(ref)
        citations.append(
            Citation(
                source_file=c.metadata.file_name,
                page=c.metadata.page,
                sheet_name=c.metadata.sheet_name,
                excerpt=c.content[:200] + "..." if len(c.content) > 200 else c.content,
                chunk_id=c.chunk_id,
            )
        )
    return citations


def _to_retrieved_chunks(
    chunks: list[DocumentChunk],
    scores: list[float],
) -> list[RetrievedChunk]:
    return [
        RetrievedChunk(
            content=c.content,
            metadata=c.metadata.to_dict(),
            score=scores[i] if i < len(scores) else None,
            chunk_id=c.chunk_id,
        )
        for i, c in enumerate(chunks)
    ]


_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
