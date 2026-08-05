---
title: "De COBOL a microservicios: escenario de modernización industrial"
description: "Escenario ilustrativo para planear la migración gradual de un sistema COBOL a servicios modernos sin detener una operación industrial."
pubDate: 2026-07-05
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Modernización Legacy", "COBOL", "Microservicios", "Manufactura", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este contenido es un escenario ilustrativo. La organización, los tiempos, costos y resultados descritos son hipotéticos y sirven para mostrar un enfoque de modernización; no constituyen un caso de cliente verificable.

El sistema era de 1994. No había documentación. El único desarrollador que lo conocía se había jubilado cinco años atrás, y dejó comentarios en el código que nadie del equipo actual podía interpretar. La empresa manufacturera — con tres plantas en Antioquia y más de 800 empleados — dependía de este sistema para todo: control de inventarios, órdenes de producción, facturación y nómina.

El riesgo no era hipotético. **El sistema fallaba en promedio dos veces por año**, cada fallo detenía la producción entre 4 y 14 horas, y el costo de cada parada rondaba los $80 millones de pesos.

## Por Qué No Hicimos un "Big Bang"

La tentación del big bang — reescribir todo de cero y hacer el cambio de un solo día — es enorme. También es una de las causas más frecuentes de fracaso en proyectos de modernización enterprise.

Las razones por las que lo rechazamos:

1. **Riesgo operacional**: la empresa no podía permitirse ni 8 horas sin sistema de producción
2. **Conocimiento tácito**: el 30% de la lógica de negocio no estaba documentada y vivía solo en el código
3. **Deuda técnica acumulada**: 32 años de parches y modificaciones que interactuaban de formas no obvias

La estrategia correcta fue el **Strangler Fig Pattern**: ir envolviendo módulos del sistema legacy con capas modernas, redirigiendo el tráfico progresivamente hasta que el sistema nuevo puede operar solo.

## La Arquitectura de Transición

### Fase 1: API Gateway como Intermediario (Meses 1-2)

Instalamos un API Gateway delante del sistema COBOL existente. Esto nos permitió:
- Observar el tráfico real de comunicación entre módulos
- Identificar los puntos de entrada y salida del sistema
- Comenzar a documentar el comportamiento real (no el esperado)

```
[Plantas de producción]
        ↓
[API Gateway] → [Sistema COBOL original]
        ↓ (logging de todas las transacciones)
[Repositorio de comportamiento documentado]
```

### Fase 2: Módulos Nuevos en Paralelo (Meses 3-5)

Construimos los módulos nuevos en TypeScript/Node.js, pero no los activamos aún. Durante 8 semanas, ambos sistemas — el legacy y el nuevo — procesaban las mismas transacciones en paralelo. Comparábamos los resultados automáticamente:

```typescript
async function procesarOrdenProduccion(orden: OrdenProduccion) {
  const [resultadoLegacy, resultadoNuevo] = await Promise.all([
    legacyAdapter.procesarOrden(orden),
    nuevoSistema.procesarOrden(orden)
  ]);
  
  if (!sonEquivalentes(resultadoLegacy, resultadoNuevo)) {
    await alertas.enviar({
      tipo: 'DIVERGENCIA',
      orden: orden.id,
      legacy: resultadoLegacy,
      nuevo: resultadoNuevo
    });
  }
  
  return resultadoLegacy; // El sistema legacy sigue siendo la fuente de verdad
}
```

Encontramos **47 divergencias** en las primeras cuatro semanas. Cada una revelaba lógica de negocio no documentada que debimos implementar en el sistema nuevo.

### Fase 3: Migración Módulo por Módulo (Meses 5-7)

Con el sistema nuevo validado contra el legacy, migramos módulo por módulo en ventanas de mantenimiento de fin de semana:

| Módulo | Fin de semana | Rollback? |
|---|---|---|
| Inventarios de materia prima | Semana 18 | No |
| Órdenes de producción | Semana 20 | No |
| Calidad y trazabilidad | Semana 22 | No |
| Nómina y RRHH | Semana 24 | No |
| Facturación electrónica | Semana 26 | No |

**Cero rollbacks**. Esto fue posible porque cada módulo llegó al corte completamente validado.

## El Rol de la IA en la Documentación del Legacy

Una parte del proyecto que tomó por sorpresa al cliente: usamos Claude para analizar el código COBOL y generar documentación estructurada de la lógica de negocio.

El proceso:
1. Extraíamos fragmentos del código COBOL con contexto
2. Le pedíamos al modelo que explicara la lógica en lenguaje de negocio
3. Un analista validaba la explicación con los usuarios clave del área
4. La documentación validada se convertía en los casos de prueba del sistema nuevo

Esto aceleró la fase de documentación en aproximadamente 60%.

## Resultados al Finalizar el Proyecto

- **Cero interrupciones** de producción durante los 7 meses de migración
- Tiempo de respuesta del sistema: de 8 segundos promedio a 380 milisegundos
- Fallos del sistema en los 12 meses siguientes: **cero**
- Costo de mantenimiento anual reducido en 65% (ya no dependen de consultores COBOL)
- El equipo de TI interno puede ahora mantener y evolucionar el sistema sin dependencias externas

## Lo Que No Se Ve en las Métricas

El cambio más profundo fue cultural. El equipo de TI de la empresa, que pasó años en modo "apagaincendios", ahora tiene capacidad de innovar. Tres meses después de la migración, lanzaron por iniciativa propia un módulo de predicción de mantenimiento preventivo — algo imposible con el sistema legacy.

La modernización no solo resolvió el problema técnico. Devolvió al equipo la capacidad de pensar en el futuro.
