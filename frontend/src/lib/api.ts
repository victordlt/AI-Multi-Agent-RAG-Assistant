// Ruta base hacia tu servidor FastAPI
const API_BASE_URL = 'http://localhost:8000/api/v1'; 

/**
 * Consulta estándar al RAG (Búsqueda semántica simple)
 */
export async function query(payload: { query: string }): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // SOLUCIÓN AL ERROR 422: Enviamos las tres variantes posibles de llaves de datos
    body: JSON.stringify({ 
      query: payload.query,
      text: payload.query,
      question: payload.query
    }),
  });
  if (!response.ok) throw new Error('Error en la petición de consulta simple');
  return response.json();
}

/**
 * Consulta utilizando el flujo de agentes autónomos (Planner -> Retriever -> Reasoner -> Validator)
 */
export async function agentsQuery(payload: { query: string }): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // SOLUCIÓN AL ERROR 422: Aplicamos la misma regla para el endpoint de agentes
    body: JSON.stringify({ 
      query: payload.query,
      text: payload.query,
      question: payload.query
    }),
  });
  if (!response.ok) throw new Error('Error en la petición del flujo de agentes');
  return response.json();
}

/**
 * Cargar archivos PDF/Texto al servidor local
 */
export async function uploadDocument(formData: FormData): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Error al cargar el archivo');
  return response.json();
}

/**
 * Obtener la lista de documentos indexados en el sistema
 */
export async function listDocuments(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Error al listar los documentos');
  return response.json();
}
