---
title: "Text-to-SQL en banca: escenario para agilizar consultas empresariales"
description: "Escenario ilustrativo para implementar consultas en lenguaje natural sobre datos bancarios con permisos, validación y trazabilidad."
pubDate: 2026-06-10
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Text-to-SQL", "Banca", "IA Empresarial", "Escenario ilustrativo", "Colombia", "Data Engineering"]
draft: false
---

> **Nota editorial:** este contenido presenta un escenario hipotético para explicar el diseño de Text-to-SQL. La institución, las cargas de trabajo y los resultados no corresponden a un caso verificable de Saastreria.

Cuando el equipo de datos de un banco mediano colombiano nos contactó, su problema era uno que escuchamos con frecuencia: **el área de negocio dependía del equipo técnico para cualquier consulta a la base de datos**. Cada vez que un gerente necesitaba un reporte de cartera vencida por región, o el CFO quería revisar indicadores de rentabilidad, un analista debía escribir la consulta SQL, ejecutarla y entregar el resultado. El proceso tomaba entre 4 y 48 horas.

El resultado: **40 horas semanales** del equipo técnico consumidas en consultas repetitivas, y gerentes tomando decisiones con información de días o semanas de antigüedad.

## El Diagnóstico

Al revisar el stack del banco, encontramos:

- Base de datos PostgreSQL con 11 años de historia transaccional
- Esquema con más de 340 tablas y relaciones complejas entre crédito, cartera y tesorería
- Equipo de negocio con cero conocimientos de SQL
- Cultura de reportes ad-hoc: no había un modelo de datos estandarizado

El desafío no era técnico en el sentido convencional. Era un problema de **interfaz entre el lenguaje de negocio y el lenguaje de datos**.

## La Arquitectura Text-to-SQL que Implementamos

Diseñamos una solución en tres capas:

### 1. Capa de Contexto Semántico

Construimos un diccionario de negocio que traduce términos empresariales a definiciones técnicas precisas:

```yaml
cartera_vencida:
  tabla: creditos
  columna: saldo_mora
  condicion: "dias_mora > 30"
  descripcion: "Saldo total de créditos con más de 30 días de mora"
  
rentabilidad_regional:
  joins: [creditos, regionales, productos]
  metrica: "SUM(ingresos_financieros) - SUM(costos_fondeo)"
```

Este contexto semántico es crítico. Sin él, el modelo LLM genera SQL técnicamente válido pero conceptualmente incorrecto.

### 2. Motor de Generación SQL con Claude

Usamos Claude claude-sonnet-4-6 como motor de razonamiento, con un prompt de sistema que incluye:
- El esquema completo de las 340 tablas
- El diccionario de negocio
- Ejemplos few-shot de preguntas frecuentes y sus consultas correctas
- Restricciones de seguridad (solo SELECT, sin acceso a tablas de autenticación)

### 3. Capa de Validación y Ejecución

Antes de ejecutar cualquier query, el sistema:
1. Valida que sea exclusivamente una operación SELECT
2. Verifica que no acceda a tablas fuera del alcance autorizado
3. Agrega automáticamente filtros de período fiscal
4. Limita el resultado a 10.000 filas para prevenir queries destructivas

## Resultados a los 90 Días

| Métrica | Antes | Después |
|---|---|---|
| Horas técnicas en reportes/semana | 40 h | 4 h |
| Tiempo promedio de respuesta | 6 horas | 45 segundos |
| Consultas ad-hoc por semana | 23 | 87 |
| Precisión de las respuestas | — | 94% |

El dato más revelador: cuando el equipo de negocio tuvo acceso directo a los datos, **generaron el triple de consultas**. No porque antes hicieran menos preguntas, sino porque antes se autocensuraban por el costo de molestar al equipo técnico.

## Los Errores que Evitamos

### No reutilizamos el esquema original sin modificaciones

La primera versión del sistema generaba SQL correcto técnicamente pero lento en ejecución. Añadimos una capa de optimización que identifica los índices disponibles y sugiere el plan de ejecución más eficiente antes de enviar la query.

### No ignoramos los casos límite

El 6% de preguntas que el sistema no puede responder con confianza alta generan una respuesta honesta: *"Esta pregunta requiere cruzar información que no está disponible directamente. Te recomiendo reformularla o contactar al equipo de datos."*

## Implementación Progresiva

El rollout se hizo en fases:

**Semana 1-2:** Piloto con 5 usuarios del área de riesgo  
**Semana 3-4:** Expansión a gerentes regionales (22 usuarios)  
**Semana 5-8:** Integración con el portal de gestión bancaria  
**Semana 9-12:** Módulo de alertas automáticas basadas en consultas programadas

## Consideraciones de Seguridad en Banca

Este punto es innegociable. La implementación incluyó:

- **Row-level security**: cada usuario solo ve datos de su región y portafolio autorizado
- **Audit log completo**: cada query generada se registra con timestamp, usuario y resultado
- **Revisión semanal** del equipo de seguridad de las consultas más frecuentes
- **Sin exposición directa al LLM**: el modelo nunca ve datos transaccionales reales, solo el esquema

---

Si tu equipo dedica horas semanales a generar reportes que deberían estar disponibles en segundos, el problema no es de personas — es de arquitectura. Text-to-SQL bien implementado democratiza el acceso a los datos sin comprometer la seguridad.

**¿Tu empresa enfrenta una situación similar?** En Saastreria hemos implementado soluciones Text-to-SQL en sectores de banca, retail y manufactura. Agenda un diagnóstico gratuito con nuestro equipo.
