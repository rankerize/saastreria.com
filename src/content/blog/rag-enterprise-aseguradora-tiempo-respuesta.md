---
title: "RAG empresarial en seguros: escenario de atención con conocimiento asistido"
description: "Escenario ilustrativo de un sistema RAG sobre documentos de pólizas y siniestros, con permisos, citas y controles para apoyar la atención."
pubDate: 2026-06-24
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["RAG", "Inteligencia Artificial", "Seguros", "Escenario ilustrativo", "Colombia", "LLMOps"]
draft: false
---

> **Nota editorial:** este es un escenario ilustrativo. La aseguradora, el corpus y las métricas son hipotéticos; muestran cómo evaluar una solución, pero no representan un caso de cliente verificable.

Las aseguradoras tienen un problema de conocimiento distribuido: **miles de documentos** — pólizas, cláusulas, exclusiones, circulares de la Superintendencia Financiera, manuales de siniestros — y agentes que necesitan respuestas precisas en segundos mientras el cliente espera al teléfono.

En una aseguradora colombiana de tamaño mediano, este problema se manifestaba así: tiempo promedio de atención de 4 horas por siniestro simple, porque el agente debía buscar manualmente en documentos PDF, consultar a supervisores o llamar a back office. **El 60% de ese tiempo era búsqueda de información**, no trabajo real de gestión.

## El Inventario Documental

Antes de diseñar la solución, auditamos el corpus:

- **15.240 documentos** en total (PDFs, Word, Excel)
- Pólizas de vida, SOAT, hogar, PYME y salud colectiva
- Circulares normativas de los últimos 8 años
- Manuales internos de gestión de siniestros
- Bases de datos de precedentes de liquidación

El problema adicional: muchos documentos tenían versiones distintas para la misma cobertura según el año de emisión de la póliza.

## Arquitectura RAG que Implementamos

### Indexación Semántica con pgvector

Elegimos PostgreSQL con la extensión `pgvector` sobre soluciones propietarias como Pinecone, por tres razones: el equipo ya conocía Postgres, los datos no podían salir de la infraestructura interna, y el costo operativo es significativamente menor.

```sql
CREATE TABLE documentos_seguro (
  id SERIAL PRIMARY KEY,
  contenido TEXT,
  tipo_documento VARCHAR(50),
  version_poliza VARCHAR(20),
  fecha_vigencia DATE,
  embedding VECTOR(1536)
);

CREATE INDEX ON documentos_seguro 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Pipeline de Ingesta

El proceso de ingesta de un documento nuevo toma aproximadamente 2 minutos:

1. **Extracción**: OCR para PDFs escaneados, parsing directo para digitales
2. **Chunking semántico**: dividimos por sección, no por token count, para preservar el contexto normativo
3. **Enriquecimiento**: cada chunk incluye metadata de tipo de póliza, versión y fecha de vigencia
4. **Vectorización**: usamos el modelo de embeddings de Anthropic
5. **Almacenamiento**: inserción en pgvector con metadatos para filtrado

### Recuperación con Filtrado por Contexto

La clave del RAG en seguros no es solo recuperar el documento más similar semánticamente, sino **el más relevante para el contexto específico del cliente**:

```python
def buscar_clausulas(pregunta: str, tipo_poliza: str, año_emision: int):
    embedding_pregunta = generar_embedding(pregunta)
    
    resultados = db.query("""
        SELECT contenido, tipo_documento, similitud
        FROM documentos_seguro
        WHERE tipo_documento = %s
          AND fecha_vigencia <= %s
        ORDER BY embedding <=> %s
        LIMIT 5
    """, [tipo_poliza, f"{año_emision}-12-31", embedding_pregunta])
    
    return resultados
```

Este filtrado por metadata reduce la tasa de alucinaciones de un 12% a menos del 2%.

## Los Resultados

| Indicador | Antes | Después | Mejora |
|---|---|---|---|
| Tiempo promedio atención siniestros | 4.2 horas | 49 minutos | -81% |
| Escalaciones a back office | 47% de casos | 11% de casos | -77% |
| Satisfacción del cliente (CSAT) | 3.4/5 | 4.6/5 | +35% |
| Capacidad de atención por agente | 8 casos/día | 21 casos/día | +162% |

El resultado más inesperado fue el efecto sobre los agentes: al liberarlos de la búsqueda manual, **dedicaron más tiempo a la empatía con el cliente**. El CSAT subió no solo por rapidez, sino por calidad de la interacción.

## Guardianes de la Precisión

En seguros, una respuesta incorrecta puede tener consecuencias legales. Implementamos tres capas de validación:

**1. Confianza mínima**: si el sistema no encuentra documentos con similitud coseno > 0.82, responde que no tiene información suficiente y escala al supervisor.

**2. Cita obligatoria**: cada respuesta incluye la fuente exacta (número de cláusula, versión de póliza, artículo normativo) para que el agente pueda verificar.

**3. Revisión humana de precedentes**: las respuestas sobre montos de indemnización siempre requieren confirmación del liquidador, el RAG solo provee el contexto.

## Lecciones para Equipos de IA en Seguros

La mayor lección de este proyecto: **el problema no era técnico, era de confianza**. Los agentes tardaron 3 semanas en confiar en el sistema. La estrategia que funcionó fue mostrarles en tiempo real la fuente de cada respuesta, para que vieran que el sistema no "inventaba" sino que citaba.

El segundo aprendizaje: la calidad del chunking importa más que el modelo. Probamos tres modelos de embeddings con el mismo corpus chunked semánticamente vs por tokens. El chunking semántico con un modelo mediano superó consistentemente al chunking por tokens con el modelo más potente.

---

Si tu empresa gestiona grandes volúmenes de documentos internos y tu equipo pierde horas buscando información, RAG Enterprise puede transformar esa dinámica. Los fundamentos son replicables en cualquier sector con documentación densa: legal, salud, manufactura, gobierno.
