import React, { useState } from 'react';
import { query, agentsQuery } from '../lib/api';

export default function AskPage() {
  const [inputQuery, setInputQuery] = useState('');
  const [useAgent, setUseAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Si el switch está activo, usa el flujo de agentes. Si no, la búsqueda simple.
      const data = useAgent 
        ? await agentsQuery({ query: inputQuery }) 
        : await query({ query: inputQuery });
      setResult(data);
    } catch (err) {
      alert('Ocurrió un error al procesar tu solicitud con el LLM local.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-8">
          
          {/* Encabezado Principal */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">🧠 Panel de Consulta RAG Local</h2>
            <p className="text-muted">Interactúa con tus documentos usando Llama 3 de forma 100% privada</p>
          </div>

          {/* Formulario de Entrada */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="question" className="form-label fw-semibold">Escribe tu pregunta:</label>
                  <input
                    type="text"
                    id="question"
                    className="form-control form-control-lg"
                    placeholder="Ej. ¿Qué dice el documento sobre los objetivos del proyecto?"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Switch para activar Flujo de Agentes Autónomos */}
                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="agentToggle"
                    checked={useAgent}
                    onChange={(e) => setUseAgent(e.target.checked)}
                    disabled={loading}
                  />
                  <label className="form-check-input-label fw-medium ms-2" htmlFor="agentToggle">
                    Activar flujo multi-agente autónomo (Planner → Retriever → Reasoner → Validator)
                  </label>
                </div>

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading || !inputQuery.trim()}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando localmente con Llama 3...
                    </>
                  ) : (
                    'Enviar Consulta'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sección de Resultados */}
          {result && (
            <div className="card shadow-sm border-success mb-4">
              <div className="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center">
                <span>✨ Respuesta Generada</span>
                <span className="badge bg-light text-success text-uppercase">Ollama Local</span>
              </div>
              <div className="card-body">
                {/* Muestra la respuesta respetando saltos de línea */}
                <p className="card-text fs-5" style={{ whiteSpace: 'pre-line' }}>
                  {result.answer || result.response || "No se pudo recuperar una respuesta válida."}
                </p>

                {/* Si se usaron agentes, muestra el resumen técnico abajo */}
                {result.execution_summary && (
                  <div className="mt-4 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-secondary mb-2">📋 Resumen Técnico del Flujo de Agentes</h6>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1">
                        <strong>Estrategia del Planner:</strong> {result.execution_summary.planned_query || 'Búsqueda directa'}
                      </li>
                      <li>
                        <strong>Validación Final:</strong> {result.execution_summary.validation_result || 'Aprobada'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
