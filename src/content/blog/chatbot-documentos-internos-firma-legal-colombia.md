---
title: "RAG documental para una firma legal: escenario de búsqueda interna"
description: "Escenario ilustrativo de un sistema RAG para consultar contratos, precedentes y documentos internos con permisos y citas."
pubDate: 2026-08-02
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["RAG", "Legal Tech", "Chatbot", "Gestión Documental", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este contenido describe un escenario hipotético. La firma, el volumen documental, los tiempos y resultados se utilizan para explicar el enfoque y no corresponden a un caso de cliente verificable.

La firma tenía 23 abogados y 12.000 documentos acumulados en 11 años: contratos tipo, modelos de demandas, conceptos jurídicos, actas de reuniones con clientes, y la jurisprudencia interna que el equipo había recopilado caso por caso.

El problema no era que los documentos no existieran. Era que **nadie sabía exactamente dónde estaban ni cómo encontrarlos rápido**.

Un abogado junior pasaba en promedio 47 minutos buscando el contrato correcto antes de empezar a trabajar en él. Un socio preparando una audiencia revisaba manualmente carpetas de Drive durante 2 horas para encontrar precedentes relevantes.

**200 horas mensuales del equipo se iban en búsqueda documental. Cero en producir valor jurídico.**

## Por Qué la Búsqueda Tradicional No Funciona en Documentos Legales

La búsqueda por palabras clave falla con documentos legales por una razón fundamental: el lenguaje jurídico es semánticamente denso. Un contrato de arrendamiento puede hablar de "obligaciones del locatario", "responsabilidades del arrendatario" o "deberes del inquilino" — todos significan lo mismo, pero una búsqueda exacta solo encuentra uno.

Los sistemas de búsqueda de Google Drive, SharePoint o cualquier explorador de archivos buscan coincidencias de texto, no significado.

**La búsqueda semántica sobre vectores** resuelve este problema porque convierte el texto en representaciones matemáticas del significado. Documentos con contenido similar quedan cerca en el espacio vectorial, sin importar las palabras exactas usadas.

## La Arquitectura del Sistema

El sistema que construimos tiene cuatro componentes:

### 1. Ingesta y Vectorización del Corpus Documental

Los 12.000 documentos llegaban en tres formatos: PDF (73%), Word (24%) y texto plano (3%). Construimos un pipeline de ingesta que:

- Extrae el texto de cada formato con sus metadatos (fecha, tipo de documento, área jurídica, abogado responsable)
- Divide cada documento en fragmentos de 800 tokens con 200 tokens de solapamiento para preservar contexto
- Genera embeddings vectoriales usando un modelo de embeddings en español
- Almacena los vectores en PostgreSQL con `pgvector`

```python
def procesar_documento(path: str, metadatos: dict) -> list[Chunk]:
    texto = extraer_texto(path)
    fragmentos = dividir_con_solapamiento(texto, tamaño=800, solapamiento=200)
    
    chunks = []
    for i, fragmento in enumerate(fragmentos):
        embedding = modelo_embeddings.encode(fragmento)
        chunks.append(Chunk(
            contenido=fragmento,
            embedding=embedding,
            documento_id=metadatos['id'],
            tipo=metadatos['tipo'],
            area=metadatos['area_juridica'],
            posicion=i
        ))
    return chunks
```

### 2. Búsqueda Híbrida (Semántica + Léxica)

La búsqueda pura por vectores a veces pierde términos jurídicos muy específicos (números de artículos, nombres propios, fechas). Implementamos búsqueda híbrida que combina ambos enfoques:

```sql
-- Búsqueda híbrida: semántica + léxica combinadas con RRF
WITH semantica AS (
  SELECT id, contenido, documento_id,
         1 - (embedding <=> $1::vector) AS score_semantico,
         ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS rank_s
  FROM chunks
  WHERE area_juridica = ANY($2)
  ORDER BY embedding <=> $1::vector
  LIMIT 50
),
lexica AS (
  SELECT id, contenido, documento_id,
         ts_rank(to_tsvector('spanish', contenido), plainto_tsquery('spanish', $3)) AS score_lexico,
         ROW_NUMBER() OVER (ORDER BY ts_rank(to_tsvector('spanish', contenido), plainto_tsquery('spanish', $3)) DESC) AS rank_l
  FROM chunks
  WHERE to_tsvector('spanish', contenido) @@ plainto_tsquery('spanish', $3)
  LIMIT 50
)
SELECT COALESCE(s.id, l.id) as id,
       COALESCE(s.contenido, l.contenido) as contenido,
       -- Reciprocal Rank Fusion
       (1.0 / (60 + COALESCE(s.rank_s, 100)) + 1.0 / (60 + COALESCE(l.rank_l, 100))) AS score_rrf
FROM semantica s
FULL OUTER JOIN lexica l ON s.id = l.id
ORDER BY score_rrf DESC
LIMIT 10;
```

### 3. Generación con Citación de Fuentes

El LLM recibe los fragmentos relevantes y genera una respuesta que cita explícitamente cada documento:

```
Pregunta: ¿Cuál es la cláusula estándar de penalización por incumplimiento en 
contratos de prestación de servicios IT?

Respuesta: Según los contratos tipo de la firma (ver: Contrato PST-2024-v3.docx, 
cláusula 12.3), la penalización estándar es del 1.5% del valor mensual del 
contrato por día hábil de incumplimiento, con un tope máximo del 15% del valor 
total. Esta cifra fue actualizada en 2023 tras el caso EMPRESA_TECH (expediente 
interno 2023-047) donde la cláusula original del 2% fue cuestionada en 
negociación. 

Fuentes consultadas:
- Contrato PST-2024-v3.docx (Área Corporativa)
- Expediente 2023-047 (Litigios)
- Modelo-PST-v2-anterior.docx (Histórico)
```

Esta citación de fuentes fue un requerimiento no negociable del equipo jurídico: los abogados necesitaban verificar la fuente antes de usar cualquier referencia en un documento oficial.

### 4. Control de Acceso por Área Jurídica

Los documentos de litigios no son accesibles desde el área de contratación corporativa, y viceversa. Implementamos filtrado a nivel de búsqueda según el perfil del usuario:

```python
def buscar(query: str, usuario: Usuario) -> list[Resultado]:
    areas_permitidas = obtener_areas_permitidas(usuario.rol, usuario.area)
    return busqueda_hibrida(
        query=query,
        filtro_areas=areas_permitidas,
        top_k=10
    )
```

## Lo Que el Sistema No Puede Hacer

Fuimos explícitos desde el inicio: el chatbot **no da concepto jurídico**. Da contexto documental. La diferencia es crítica:

- **SÍ hace**: "El contrato 2023-A tiene estas cláusulas de garantía"
- **NO hace**: "Deberías incluir esta cláusula en el nuevo contrato"

La firma conservó la regla de que cualquier recomendación jurídica pasa por revisión humana. El chatbot acelera la investigación documental, no reemplaza el criterio del abogado.

## Resultados a los 4 Meses

| Indicador | Antes | Después |
|---|---|---|
| Tiempo promedio de búsqueda documental | 47 minutos | 3.2 minutos |
| Horas mensuales en búsqueda | 200 h | 13.5 h |
| Documentos consultados por búsqueda | 3–5 | 8–12 |
| Casos donde se encontró precedente relevante | 34% | 71% |

El indicador más revelador fue el último: los abogados ahora encuentran precedentes internos relevantes en el 71% de los casos nuevos. Antes, con búsqueda manual, solo en el 34%. Los otros 37 puntos porcentuales existían en los documentos — simplemente eran inaccesibles en la práctica.

## El Efecto Secundario: Cultura de Documentación

Antes de implementar el sistema, muchos abogados guardaban sus propias notas y plantillas localmente. El valor del chatbot dependía directamente de la calidad del corpus — lo que motivó al equipo a digitalizar y centralizar documentos que llevaban años en discos locales.

**El chatbot no solo consuminó la base de conocimiento existente — la hizo crecer.**
