---
title: "Pipeline de datos en tiempo real: escenario para retail colombiano"
description: "Escenario ilustrativo para integrar fuentes desconectadas y construir una visión operacional más actualizada en una empresa de retail."
pubDate: 2026-07-12
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Data Engineering", "Pipeline de Datos", "Retail", "Tiempo Real", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este ejemplo es ilustrativo. La cadena, los volúmenes y los indicadores son hipotéticos y se usan para explicar una posible arquitectura; no corresponden a un caso de cliente verificable.

La cadena retail tenía 47 tiendas distribuidas en 12 ciudades colombianas. Cada tienda generaba datos en seis sistemas distintos: punto de venta, inventarios, CRM de fidelización, RRHH, facturación y logística. Ninguno hablaba con los demás.

El resultado: el director comercial tomaba decisiones de aprovisionamiento con datos de 3 días de antigüedad. Las campañas de fidelización se diseñaban sin saber qué había pasado en ventas la semana anterior. Y el equipo de logística descubría los quiebres de inventario cuando el cliente ya había comprado en la competencia.

**El problema no era falta de datos — era fragmentación.**

## Diagnóstico: El Mapa de Silos

Antes de escribir una sola línea de código, mapeamos el flujo real de los datos:

```
Punto de Venta (6 proveedores distintos según tienda)
    ↓ CSV manual, una vez al día
    
Inventarios (sistema propietario de los 90s)
    ↓ Exportación Excel, dos veces por semana
    
CRM Fidelización (plataforma SaaS)
    ↓ API disponible pero no conectada a nada
    
RRHH (ERP corporativo)
    ↓ Sin API, exportación PDF
    
Facturación (sistema DIAN-compatible)
    ↓ Base de datos SQL accesible
    
Logística (plataforma de proveedor 3PL)
    ↓ API REST con actualización cada 4 horas
```

La fragmentación no era solo técnica. Era también de procesos: cada área "protegía" sus datos, y no había un área responsable de la integración.

## La Arquitectura del Pipeline

Diseñamos una arquitectura event-driven con tres capas:

### Capa de Ingesta (Múltiples Conectores)

Para cada fuente, construimos un conector específico:

**POS (puntos de venta):** Webhook interceptor que captura cada transacción en el momento de cierre de caja, sin importar el proveedor del POS. El truco: instalamos un agente ligero en el servidor local de cada tienda que escucha el evento de cierre y lo publica en nuestra cola.

**Inventarios legacy:** Script de polling cada 15 minutos que detecta cambios en la base de datos propietaria via triggers SQL.

**CRM:** Integración directa via API con webhooks para eventos de alta/modificación de cliente.

**RRHH:** PDF parsing automatizado con extracción de turnos y asistencia.

**Logística 3PL:** Polling mejorado a cada 5 minutos (el proveedor no ofrecía webhooks).

### Capa de Procesamiento (Apache Kafka + Flink)

Todos los eventos fluyen hacia un cluster de Kafka. Apache Flink procesa los streams en tiempo real para:

- Detectar quiebres de inventario cuando el stock cae por debajo del umbral
- Calcular ventas por hora, tienda y categoría
- Identificar patrones de abandono en fidelización
- Generar alertas de logística cuando un despacho se retrasa

### Capa de Consumo (PostgreSQL + Dashboard)

Los datos procesados llegan a PostgreSQL con un modelo de datos unificado — el único lugar donde "venta", "producto" y "cliente" tienen una sola definición. Sobre esto construimos el dashboard operacional con actualización cada 30 segundos.

## Resultados a los 6 Meses

| Indicador | Antes | Después |
|---|---|---|
| Latencia de datos para decisiones | 3 días | 30 segundos |
| Quiebres de inventario detectados a tiempo | 23% | 91% |
| Tiempo del equipo en consolidación manual | 18 h/semana | 0 h/semana |
| Campañas de fidelización con datos actualizados | 0 | 8 en 6 meses |
| Ventas del canal fidelización | — | +19% |

El indicador más valioso fue el último: las campañas de fidelización basadas en comportamiento real de compra generaron un 19% más de ventas que las campañas genéricas anteriores.

## El Problema Que No Esperábamos: La Política de Datos

El mayor obstáculo no fue técnico. Fue conseguir que el área de logística compartiera sus datos con el área comercial. La solución: en lugar de pedir "acceso a los datos", les mostramos qué decisiones tomaría el área comercial con esos datos que beneficiaban directamente a logística (menos urgencias de reposición, mejor planificación).

**Los datos se comparten cuando los interesados ven el beneficio directo, no cuando hay una política corporativa que lo ordena.**

## Costos de Operación

El pipeline corre en infraestructura propia con un costo de operación mensual de aproximadamente $1.8 millones de pesos (servicios cloud + mantenimiento). Antes, el equipo de 3 personas dedicaba 18 horas semanales a consolidar datos manualmente — un costo de oportunidad de $9.6 millones mensuales solo en tiempo humano.

El ROI del primer año: **5.3x**.
