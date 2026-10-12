![foto de ejemplo] (https://github.com/victordlt/AI-Multi-Agent-RAG-Assistant/blob/main/AI-Multi-Agent-RAG-Assistant.png)

# AI-Multi-Agent-RAG-Assistant

Un agente que permite cargar documentos y realizar consultas en lenguaje natural, basada en RAG, ChromaDB y un flujo de agentes compuesto por Planificador → Recuperador → Razonador → Validador.


## Caracteristicas:
- Modelo de lenguaje Llama3 a través de Ollama , lo que permite ejecutar el agente en local (on premise).
- Carga de archivos PDF, TXT, CSV y Excel (.xlsx)
- Búsqueda de similitud vectorial sobre embeddings de chunks (ChromaDB)
- RAG pipeline.
- Flujo de trabajo Multi-agente: Planner → Retriever → Reasoner  → Validator; resumen de ejecución y citas.

## Stack
FastAPI + LangChain + Vite + React + Bootstrap + Python + TS


## Quick Start

### Prerequisitos
 * Python 3.10 - 3.11
 * NodeJs
 * Debe estar ejecutandose Ollama con el modelo llama3
 * Docker (Opcional)

 ### Backend
 Nos posicionamos en el directorio root del backend y creamos un entorno virtual.
 ```
 cd backend
 py -3.10 -m venv .venv
```
Activamos el entorno virtual:

 * Para windows Powershell:
 ```
.\.venv\Scripts\Activate.ps1
 ```
* Para linux:
 ```
source .venv/bin/activate
 ```
Una vez activado el entorno .venv, realizamos un upgrade del pip e instalamos los requqrimientos (dependencias)
 ```
 python -m pip install --upgrade pip
 pip install -r requirements.txt
 ```
Inicializamos el servicio
 ```
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
 Nos posicionamos en el directorio root del frontend e instalamos dependencias.
 ```
 cd frontend
 npm install
```
Iniciamos el servicio de frontend
```
npm run dev
```
