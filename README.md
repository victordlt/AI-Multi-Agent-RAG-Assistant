
# Agente IA Profesional

Una solución preparada para producción que permite cargar documentos y realizar consultas en lenguaje natural, basada en RAG, ChromaDB y un flujo de agentes compuesto por Planificador → Recuperador → Razonador → Validador.


## Caracteristicas:

- Carga de archivos PDF, TXT, CSV y Excel (.xlsx)
- Búsqueda de similitud vectorial sobre embeddings de chunks (ChromaDB)
- RAG pipeline.
- Flujo de trabajo Multi-agente: Planner → Retriever → Reasoner  → Validator; resumen de ejecución y citas.




## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

