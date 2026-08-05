---
title: "IA generativa en empresas colombianas: 3 escenarios de automatización"
description: "Tres escenarios ilustrativos de IA generativa: propuestas comerciales, análisis documental y preparación de reportes ejecutivos."
pubDate: 2026-08-04
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /blog/blog-automatizacion-casos.png
tags: ["IA Generativa", "Automatización", "Colombia", "LLM", "Escenarios ilustrativos", "IA Empresarial"]
draft: false
---

> **Nota editorial:** los tres casos de este artículo son escenarios ilustrativos. Las organizaciones, cifras y resultados son hipotéticos; se presentan para mostrar cómo evaluar soluciones, no como evidencia de proyectos verificables de Saastreria.

La IA generativa dejó de ser un tema de conferencias tecnológicas. En 2025 y 2026, las empresas colombianas que están adoptando estos sistemas con criterio — no por moda, sino resolviendo problemas concretos — están viendo retornos reales.

Aquí presentamos tres escenarios de sectores distintos, con una metodología comparable y métricas que deberían validarse en un piloto real.

---

## Caso 1: Generación Automática de Propuestas Comerciales — Empresa de Consultoría

### El Problema

La empresa de consultoría de TI tenía un equipo comercial de 8 personas. Cada propuesta comercial tomaba entre 6 y 14 horas de trabajo: buscar proyectos similares anteriores, adaptar el lenguaje al sector del cliente, calcular el alcance y redactar el documento final.

Con 40-60 propuestas mensuales, el equipo comercial pasaba el 60% de su tiempo en redacción y administración — no en ventas.

### La Solución

Construimos un sistema de generación de propuestas en tres etapas:

**Etapa 1: Intake estructurado**. Un formulario captura la información clave del prospecto: sector, tamaño, problema principal, budget estimado, timeline.

**Etapa 2: Recuperación de contexto**. El sistema busca en la base de datos de proyectos anteriores los 3 casos más similares (por sector, tipo de problema y tamaño). Recupera sus alcances, metodologías y resultados documentados.

**Etapa 3: Generación con plantilla dinámica**

```python
def generar_propuesta(intake: Intake, casos_similares: list[Proyecto]) -> Propuesta:
    contexto = formatear_casos(casos_similares)
    
    prompt = f"""
    Eres un consultor senior de Saastreria generando una propuesta para:
    - Cliente: {intake.empresa} ({intake.sector})
    - Problema: {intake.problema_principal}
    - Budget: {intake.budget_usd} USD
    - Timeline: {intake.timeline}
    
    Proyectos similares exitosos que tenemos como referencia:
    {contexto}
    
    Genera una propuesta ejecutiva con:
    1. Resumen ejecutivo (2 párrafos, enfocado en el problema del cliente)
    2. Metodología propuesta (adaptada a su sector)
    3. Entregables concretos con fechas
    4. Inversión requerida y ROI estimado basado en los casos de referencia
    5. Por qué nuestra experiencia es relevante (citar los proyectos similares)
    
    Tono: profesional pero directo. Sin jerga técnica innecesaria.
    """
    
    return llm.generar(prompt, temperatura=0.3)  # Temperatura baja para consistencia
```

### Resultados a 6 Meses

- Tiempo de generación de propuesta: de 8 horas promedio a **45 minutos** (incluyendo revisión humana)
- Propuestas enviadas por mes: de 43 a **71** (mismo equipo)
- Tasa de cierre: de 18% a **24%** (mejor personalización = mejor conversión)
- El equipo comercial ahora dedica el 75% del tiempo a reuniones y relaciones — no a redacción

---

## Caso 2: Análisis Automático de Contratos — Empresa de Seguros

### El Problema

La aseguradora recibía entre 80 y 120 contratos de reaseguro al mes para revisión. Cada contrato tenía entre 40 y 200 páginas. El equipo legal tardaba 3-5 días en revisar cada uno para identificar cláusulas de riesgo, exclusiones y condiciones especiales.

El cuello de botella retrasaba el cierre de pólizas y, en algunos casos, la empresa perdía negocios porque el competidor respondía más rápido.

### La Solución

Un pipeline de análisis documental en cuatro fases:

**Fase 1 — Extracción**: PDF parsing con Document AI para extraer texto estructurado, preservando la jerarquía de cláusulas.

**Fase 2 — Clasificación de cláusulas**: Un modelo fine-tuned clasifica cada cláusula en una de 23 categorías definidas por el equipo legal (exclusiones, límites de cobertura, condiciones suspensivas, etc.).

**Fase 3 — Análisis de riesgo**: El LLM analiza las cláusulas clasificadas contra la política de riesgo interna de la empresa:

```python
CRITERIOS_RIESGO = {
    "exclusion_cyberrisks": {
        "descripcion": "Exclusión de riesgos cibernéticos",
        "nivel_riesgo": "ALTO",
        "accion_requerida": "Revisar si aplica a cobertura vigente"
    },
    "clausula_cut_through": {
        "descripcion": "Cláusula de pago directo al asegurado",
        "nivel_riesgo": "MEDIO",
        "accion_requerida": "Verificar alineación con póliza maestra"
    },
    # ... 21 criterios más
}

def analizar_clausula(clausula: str, categoria: str) -> AnalisisRiesgo:
    criterio = CRITERIOS_RIESGO.get(categoria)
    if not criterio:
        return AnalisisRiesgo(nivel="BAJO", requiere_revision=False)
    
    # LLM analiza si la cláusula específica activa el riesgo
    activacion = llm.clasificar_binario(
        f"¿Esta cláusula activa el criterio de riesgo '{criterio['descripcion']}'?\n\nCláusula: {clausula}"
    )
    
    return AnalisisRiesgo(
        nivel=criterio["nivel_riesgo"] if activacion else "BAJO",
        accion=criterio["accion_requerida"] if activacion else None,
        fragmento_relevante=clausula[:300]
    )
```

**Fase 4 — Reporte**: Genera un resumen ejecutivo de 1 página con semáforo de riesgo, las 3-5 cláusulas que requieren atención y el tiempo estimado de revisión humana.

### Resultados a 6 Meses

- Tiempo de revisión inicial: de 4 días a **4 horas** (revisión automática) + 6 horas de validación humana para contratos de riesgo alto
- Contratos con riesgo BAJO o MEDIO: procesados con revisión humana reducida del 90% del contenido (solo validan el reporte, no el contrato completo)
- Contratos con riesgo ALTO: el abogado recibe el contrato PRE-analizado con los fragmentos relevantes destacados
- Ninguna cláusula de riesgo ALTO ha pasado desapercibida en 6 meses de operación (cero falsos negativos en auditoría mensual)

---

## Caso 3: Reporting Ejecutivo Automatizado — Holding con 6 Empresas

### El Problema

El CFO del holding consolidaba información de 6 empresas subsidiarias cada mes para presentar al directorio. El proceso: recopilar reportes de 6 contadores distintos, en 6 formatos distintos, homologarlos, cruzar con los dashboards de ventas, y redactar el informe narrativo del mes.

Tomaba 3 semanas. El directorio recibía información de hace 3 semanas.

### La Solución

Automatizamos el pipeline completo:

**Recopilación**: Las 6 empresas ahora cargan sus datos en un formato unificado (plantilla Excel estandarizada). Un agente de automatización verifica que lleguen antes del día 5 de cada mes y alerta por WhatsApp si alguna está pendiente.

**Consolidación**: Pipeline Python que procesa los 6 archivos, detecta inconsistencias contables (partidas que no cuadran entre empresas) y genera las tablas consolidadas.

**Narrativa**: El LLM recibe los datos consolidados y genera el análisis narrativo:

```python
def generar_narrativa_mensual(datos: DatosConsolidados, mes_anterior: DatosConsolidados) -> str:
    variaciones = calcular_variaciones(datos, mes_anterior)
    alertas = identificar_alertas(variaciones, umbrales=UMBRALES_DIRECTORIO)
    
    prompt = f"""
    Eres el CFO del holding. Genera el análisis narrativo del mes {datos.periodo}.
    
    Datos consolidados:
    {datos.to_summary_json()}
    
    Variaciones vs mes anterior:
    {variaciones.to_json()}
    
    Alertas que requieren atención del directorio:
    {[a.descripcion for a in alertas]}
    
    Escribe el análisis en tres secciones:
    1. Resumen ejecutivo (qué pasó este mes, máximo 3 párrafos)
    2. Análisis por empresa (1 párrafo cada una, enfocado en lo relevante)
    3. Puntos de atención para el directorio (lista concreta de decisiones requeridas)
    
    Usa lenguaje financiero preciso pero sin tecnicismos innecesarios.
    No incluyas datos que no estén en los números provistos.
    """
    
    return llm.generar(prompt, temperatura=0.1)  # Mínima temperatura: precisión sobre creatividad
```

El CFO revisa y aprueba la narrativa — no la escribe desde cero.

### Resultados a 6 Meses

- Tiempo de preparación del informe mensual: de 3 semanas a **3 días** (recopilación + revisión)
- El directorio recibe información con 18 días menos de retraso
- Inconsistencias contables detectadas automáticamente: 7 en 6 meses (habían pasado desapercibidas en el proceso manual)
- El CFO ahora usa el tiempo liberado en análisis de escenarios y planificación estratégica

---

## Lo Que Estos Tres Casos Tienen en Común

Tres sectores distintos, tres problemas distintos. Pero el patrón es idéntico:

1. **Había un proceso repetitivo que consumía talento caro** (abogados redactando, contadores consolidando, comerciales copiando)
2. **El proceso tenía una estructura subyacente** que podía formalizarse para que el LLM la siguiera
3. **La revisión humana no desapareció** — se redefinió: de hacer todo el trabajo a validar el resultado del sistema
4. **Los datos de referencia internos eran críticos**: los tres sistemas funcionan mejor cuantos más casos, contratos y datos propios tienen disponibles

La IA generativa en la empresa no automatiza el trabajo humano. **Automatiza la parte del trabajo que no requiere juicio humano**, para que el juicio humano pueda enfocarse donde realmente importa.
