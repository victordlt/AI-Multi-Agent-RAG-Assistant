import React from 'react';

interface ExecutionSummary {
  planned_query?: string;
  validation_result?: string;
  retrieval_count?: number;
}

interface AnswerPanelProps {
  result: {
    answer?: string;
    response?: string;
    execution_summary?: ExecutionSummary;
  } | null;
  loading: boolean;
}

export default function AnswerPanel({ result, loading }: AnswerPanelProps) {
  // Si está cargando, mostramos un esqueleto de carga o spinner estilizado
  if (loading) {
    return (
      <div className="card shadow-sm border-primary mb-4 animate-pulse">
        <div className="card-body p-4 text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5 className="fw-bold text-primary">Procesando Consulta Local</h5>
          <p className="text-muted small mb-0">
            Los agentes de Ollama están analizando los fragmentos en tu base de datos vectorial...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay resultados todavía, el panel no se muestra
  if (!result) return null;

  // Extraer el texto de la respuesta (soportando ambas variantes de llaves de API)
  const finalAnswer = result.answer || result.response || "No se recibió una respuesta válida del LLM local.";
  const summary = result.execution_summary;

  return (
    <div className="card shadow-sm border-success mb-4">
      
      {/* 🏷️ CABECERA DEL PANEL */}
      <div className="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
          <span className="me-2 fs-5">✨</span>
          <span>Respuesta del Sistema RAG</span>
        </div>
        <span className="badge bg-light text-success text-uppercase fw-bold border border-success">
          Ollama: Llama 3
        </span>
      </div>

      {/* 📄 CONTENIDO PRINCIPAL */}
      <div className="card-body p-4">
        
        {/* Respuesta formateada respetando saltos de línea y viñetas */}
        <div 
          className="card-text text-dark fs-5 lh-base" 
          style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
        >
          {finalAnswer}
        </div>

        {/* 📋 RESUMEN TÉCNICO DE EJECUCIÓN (Solo si se activó el flujo multi-agente) */}
        {summary && (
          <div className="mt-4 p-3 bg-light rounded border border-secondary border-opacity-25">
            <h6 className="fw-bold text-secondary mb-3 d-flex align-items-center">
              <span className="me-2">📋</span> Resumen de Operación (Multi-Agente)
            </h6>
            
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <small className="text-muted d-block">
                  <strong>Planificación del Query:</strong>
                </small>
                <span className="badge bg-secondary bg-opacity-10 text-secondary border p-2 text-wrap w-100 text-start">
                  {summary.planned_query || 'Búsqueda directa / No modificada'}
                </span>
              </div>
              
              <div className="col-12 col-md-6">
                <small className="text-muted d-block">
                  <strong>Estatus de Validación Técnica:</strong>
                </small>
                <span className={`badge border p-2 w-100 text-start ${
                  summary.validation_result?.toLowerCase().includes('fail') || summary.validation_result?.toLowerCase().includes('inval')
                    ? 'bg-danger bg-opacity-10 text-danger border-danger' 
                    : 'bg-success bg-opacity-10 text-success border-success'
                }`}>
                  {summary.validation_result || 'Aprobada con éxito'}
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
