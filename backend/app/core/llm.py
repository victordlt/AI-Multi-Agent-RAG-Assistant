"""Factory de LLM compartida que utiliza el núcleo de LangChain (BaseChatModel).

Agents and RAG use this to get a chat model. La implementación es compatible con Ollama
, pero los componentes que la invocan dependen únicamente de las interfaces de langchain_core
(messages, invoke). Posteriormente, se pueden añadir otros proveedores (Anthropic, etc.) mediante la configuración.
"""

from typing import Optional

from langchain_core.language_models.chat_models import BaseChatModel

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_llm: Optional[BaseChatModel] = None

def get_llm() -> Optional[BaseChatModel]:
    """Return a LangChain BaseChatModel. Lazy init."""
    global _llm
    if _llm is not None:
        return _llm
    settings = get_settings()

    try:
        from langchain_community.llms import Ollama
        _llm = Ollama(model=settings.llm_model)

        return _llm
    except Exception as e:
        logger.warning("llm_init_failed", error=str(e))
        return None
