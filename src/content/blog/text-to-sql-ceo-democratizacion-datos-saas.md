---
title: "Text-to-SQL para dirección: escenario de acceso empresarial a datos"
description: "Escenario ilustrativo de una interfaz en lenguaje natural sobre un data warehouse, con definiciones métricas y controles de acceso."
pubDate: 2026-07-26
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Text-to-SQL", "SaaS", "Democratización de Datos", "BI", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este es un escenario ilustrativo. La empresa, sus cifras y los resultados son hipotéticos y se incluyen para explicar el enfoque; no constituyen un caso de cliente verificable.

El CEO de una SaaS colombiana con 180 empleados tenía acceso a un dashboard de métricas actualizado diariamente. El problema: cada vez que quería profundizar en un dato — ¿cuánto churn tenemos en clientes del sector retail con más de 2 años? ¿cuál es el LTV promedio de clientes adquiridos por canal digital en 2025? — debía pedir al equipo de datos que generara un reporte ad-hoc.

El equipo de datos tardaba entre 2 y 24 horas. El CEO esperaba. Cuando llegaba el reporte, el contexto de la pregunta ya había cambiado.

**El problema no era la velocidad del equipo. Era la fricción del intermediario.**

## Por Qué los Dashboards No Son Suficientes

Los dashboards responden a preguntas que alguien anticipó de antemano. Son excelentes para monitoreo y son terribles para exploración.

Un CEO no navega datos linealmente. Salta de una pregunta a la siguiente, cada respuesta genera una nueva pregunta más específica. Este comportamiento exploratorio requiere una interfaz conversacional, no una pantalla fija.

La diferencia:

**Dashboard (estático):**
> Ver: MRR = $287K → El CEO se pregunta: ¿De qué segmento viene el crecimiento? → Espera el reporte → 8 horas después → Recibe datos → Ya tomó la decisión con información incompleta

**Text-to-SQL (interactivo):**
> "¿Cuánto MRR aportaron clientes del sector salud este mes vs el mismo mes del año pasado?"
> → Respuesta en 12 segundos → "¿Y cuál es su tasa de churn comparada con el promedio?" → 8 segundos → "¿Qué plan tienen los 3 clientes de salud que churnearon este trimestre?" → 5 segundos

## La Implementación en una SaaS

El data warehouse de la empresa tenía 28 tablas en BigQuery, incluyendo datos de MRR, clientes, contratos, usage, soporte y churn. El reto era que muchas métricas SaaS son calculadas (LTV, NRR, CAC payback) y no existen como columnas directas.

### Capa de Métricas Calculadas

Antes de conectar el LLM, construimos una capa de vistas predefinidas en BigQuery para las métricas calculadas:

```sql
-- Vista: LTV por segmento
CREATE OR REPLACE VIEW metricas.ltv_por_segmento AS
SELECT 
  c.segmento,
  AVG(
    (SELECT SUM(monto) FROM pagos p 
     WHERE p.cliente_id = c.id) / 
    NULLIF(DATEDIFF(CURRENT_DATE, c.fecha_inicio, MONTH), 0) * 
    (1 / NULLIF(tasa_churn_mensual, 0))
  ) as ltv_estimado
FROM clientes c
JOIN metricas_churn mc ON c.segmento = mc.segmento
GROUP BY c.segmento;
```

El LLM consulta las vistas, no las tablas base. Esto garantiza que las métricas calculadas sean consistentes con las definiciones del negocio.

### Contexto Semántico para SaaS

El diccionario semántico fue crítico para evitar ambigüedades:

```yaml
churn:
  definicion: "Cliente que no renovó su contrato después de la fecha de vencimiento"
  periodo_gracia: 15  # días antes de marcar como churned
  nota: "Los downgrades NO son churn"
  
mrr:
  definicion: "Monthly Recurring Revenue — solo contratos anuales divididos en 12"
  excluye: ["one-time fees", "servicios profesionales", "setup fees"]
  
cliente_activo:
  definicion: "Cliente con contrato vigente Y al menos 1 login en los últimos 30 días"
```

Sin estas definiciones, el LLM podría interpretar "clientes activos" de seis formas distintas — todas técnicamente razonables, pero ninguna consistente con cómo el negocio los define.

## Lo Que el CEO Pregunta Realmente

Después de 3 meses de uso, analizamos los patrones de consulta. Las preguntas más frecuentes no eran las que el equipo de datos esperaba:

1. **Comparaciones temporales específicas**: "vs mismo periodo año anterior" o "vs el trimestre que siguió a la última campaña de precios"
2. **Segmentaciones cruzadas**: clientes por industria + tamaño + canal de adquisición + plan
3. **Preguntas de cohorte**: comportamiento de clientes según su mes de adquisición
4. **Preguntas hipotéticas**: "si reducimos el precio del plan básico 15%, ¿cuántos clientes upgradeados podrían hacer downgrade?"

Las preguntas hipotéticas requirieron una extensión del sistema: conectamos el motor de simulación del equipo financiero para que el LLM pudiera generar escenarios.

## Adopción y Cambio Cultural

Los primeros usuarios fueron el CEO y los dos VPs de ventas y producto. En 6 semanas, el equipo de customer success lo adoptó espontáneamente.

El indicador más revelador: el número de solicitudes ad-hoc al equipo de datos cayó **78% en 3 meses**. Pero el equipo de datos no se quedó sin trabajo — dedicó ese tiempo a construir modelos predictivos de churn que el sistema ahora puede consultar directamente.

**Cuando el acceso a datos se democratiza, la demanda de análisis sofisticado no baja — sube.**

## Consideraciones de Seguridad

En una SaaS, los datos de clientes son críticos. Las restricciones implementadas:

- El sistema solo permite SELECT — ninguna modificación de datos posible
- Los datos de contratos y condiciones comerciales no están accesibles (riesgo de competencia)
- Cada consulta se registra con el usuario que la realizó
- Los datos de clientes individuales solo son visibles para los roles con permiso explícito
