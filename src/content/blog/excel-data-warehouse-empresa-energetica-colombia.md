---
title: "De Excel a Data Warehouse: escenario para una empresa energética"
description: "Escenario ilustrativo para migrar información operativa desde hojas de cálculo hacia una plataforma de datos gobernada."
pubDate: 2026-08-04
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Data Warehouse", "BigQuery", "Migración de Datos", "Energía", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este es un escenario ilustrativo. La empresa, el inventario de archivos y los resultados son hipotéticos; el objetivo es mostrar un método de migración y las métricas que conviene medir.

El área de operaciones tenía un archivo maestro de Excel con 340 hojas. Cada hoja era un mes de datos de generación, distribución y pérdidas técnicas de las plantas. El archivo pesaba 890 MB, tardaba 4 minutos en abrirse, y tres personas en la empresa sabían cómo navegar su estructura.

Cuando uno de esos tres renunció, la empresa tardó 6 semanas en encontrar una fórmula rota que llevaba 2 años produciendo datos incorrectos en los reportes al regulador.

**El Excel no era el problema. Era el síntoma de que la empresa nunca había construido una infraestructura de datos.**

## El Diagnóstico: Siete Años de Datos Atrapados en Hojas de Cálculo

La auditoría de datos reveló el estado real:

- **340 hojas de Excel** distribuidas en 12 archivos distintos (uno por año, más archivos históricos de proyectos)
- **Formatos inconsistentes**: columnas con distinto nombre según el año, fechas en tres formatos distintos, valores en kWh en algunas hojas y MWh en otras
- **Métricas calculadas con fórmulas distintas**: el "factor de planta" se calculaba diferente en los archivos de 2019-2022 vs 2023 en adelante — nadie lo había documentado
- **Datos de terceros no integrados**: las lecturas de medidores de los distribuidores llegaban por email en PDF, y alguien los transcribía manualmente a Excel cada mes

## La Estrategia de Migración

No migramos todo de golpe. La estrategia fue en tres fases para minimizar riesgos y mantener operativa la empresa durante la transición.

### Fase 1: Auditoría y Canonización del Schema (Semanas 1-4)

Antes de mover un solo dato, definimos el modelo canónico. Trabajamos con los ingenieros operacionales para documentar qué significaba cada campo — no lo que decía el nombre de la columna, sino qué medía realmente:

```yaml
# Schema canónico de mediciones operacionales
medicion_planta:
  planta_id: string           # ID único de planta
  timestamp_utc: datetime     # SIEMPRE en UTC, nunca hora local
  energia_generada_kwh: float # Energía activa neta de barras
  energia_reactiva_kvar: float
  factor_planta: float        # energia_generada / (capacidad_instalada * horas_periodo)
  tipo_combustible: enum[hidro, termico, solar, eolico]
  disponibilidad_pct: float   # Horas disponibles / horas del periodo

perdida_tecnica:
  segmento_id: string
  periodo_inicio: datetime
  periodo_fin: datetime
  energia_entrada_kwh: float
  energia_salida_kwh: float
  perdida_kwh: float          # Calculado: entrada - salida
  perdida_pct: float          # Calculado: perdida / entrada * 100
```

Este schema fue validado y firmado por el director de operaciones. A partir de ese momento, cualquier dato que entrara al warehouse debía ajustarse a este modelo — sin excepciones.

### Fase 2: ETL Histórico (Semanas 5-10)

La migración de 7 años de datos históricos fue el trabajo más delicado. Construimos un pipeline de transformación en Python que:

```python
def transformar_archivo_excel(path: str, año: int) -> pd.DataFrame:
    # Cargar con el parser correcto según año (cambios de estructura)
    parser = obtener_parser_por_año(año)
    df_raw = parser.cargar(path)
    
    # Normalizar unidades
    df = normalizar_energia(df_raw)  # kWh o MWh → siempre kWh
    
    # Normalizar fechas
    df['timestamp_utc'] = pd.to_datetime(df['fecha_local'], 
                                          format=detectar_formato_fecha(df_raw)
                                         ).dt.tz_localize('America/Bogota').dt.tz_convert('UTC')
    
    # Recalcular métricas derivadas con la fórmula canónica
    df['factor_planta'] = df['energia_generada_kwh'] / (
        df['capacidad_instalada_kw'] * df['horas_periodo']
    )
    
    # Validar contra umbrales físicamente posibles
    validar_rangos(df)  # Lanza excepción si factor_planta > 1.0, etc.
    
    return df
```

Encontramos **2.847 registros con anomalías**: valores negativos de generación, fechas duplicadas, y el caso mencionado de la fórmula rota del factor de planta. Cada anomalía quedó registrada con su causa y la corrección aplicada.

### Fase 3: Integración de Fuentes en Tiempo Real (Semanas 11-16)

Con los datos históricos migrados, conectamos las fuentes operacionales en tiempo real:

**SCADA / Sistema de Control**: Los sistemas SCADA de las plantas exponen sus datos via Modbus TCP. Construimos un colector que lee las variables cada 5 minutos y las publica en Pub/Sub de Google Cloud.

**Medidores de distribuidores**: En el escenario se plantea acceso directo a las API de los principales distribuidores. Para una fuente sin API, se contempla un procesador automatizado de PDF.

**Datos climáticos** (relevante para las plantas solar e hidro): Integración con la API del IDEAM para correlacionar generación con precipitaciones y radiación solar.

```
[SCADA plantas]     → [Pub/Sub] → [Dataflow]  ↗
[APIs distribuidores] → [Cloud Functions]    → [BigQuery]
[IDEAM clima]         → [Cloud Scheduler]   ↗
[PDFs legacy]         → [Document AI parser]↗
```

## El Data Warehouse: Estructura en BigQuery

Diseñamos tres capas:

**Raw Layer** (`raw.*`): Datos tal como llegan, sin transformar. Nunca se modifican. Son el registro de auditoría.

**Staging Layer** (`staging.*`): Datos limpios, normalizados y con schema canónico aplicado.

**Analytics Layer** (`analytics.*`): Tablas y vistas optimizadas para consulta. Aquí viven las métricas calculadas:

```sql
-- Vista: Factor de planta mensual por tipo de tecnología
CREATE OR REPLACE VIEW analytics.factor_planta_mensual AS
SELECT
  DATE_TRUNC(timestamp_utc, MONTH) AS mes,
  tipo_combustible,
  SUM(energia_generada_kwh) AS energia_total_kwh,
  SUM(capacidad_instalada_kw * horas_periodo) AS energia_maxima_posible_kwh,
  SAFE_DIVIDE(
    SUM(energia_generada_kwh),
    SUM(capacidad_instalada_kw * horas_periodo)
  ) AS factor_planta_mensual,
  AVG(disponibilidad_pct) AS disponibilidad_promedio
FROM staging.mediciones_planta
GROUP BY 1, 2;
```

## Resultados al Año de Operación

| Indicador | Antes | Después |
|---|---|---|
| Tiempo para consolidar reporte mensual | 5 días hábiles | Automático (tiempo real) |
| Datos históricos accesibles para análisis | 2 años (limitado por Excel) | 7 años completos |
| Anomalías detectadas pro-activamente | 0 | 23 en el primer año |
| Errores en reportes al regulador | 2-3 por año | 0 en 12 meses |
| Tiempo de análisis para decisiones de inversión | 3 semanas | 2 días |

La detección proactiva de anomalías fue el beneficio más inesperado: el warehouse identificó automáticamente 23 situaciones fuera de rango en el primer año (pérdidas técnicas inusualmente altas en un segmento, caídas de disponibilidad correlacionadas con temperatura), que antes solo se detectaban cuando el problema era grave.

## El Costo de No Tenerlo

El error en la fórmula del factor de planta que llevaba 2 años sin detectarse había producido reportes incorrectos al regulador. Corregirlos requirió contratar una firma externa de auditoría y dos meses de trabajo de re-presentación de datos. Ese costo fue 4 veces mayor que el presupuesto total del proyecto de Data Warehouse.

**Los datos bien construidos no son un costo — son el seguro contra los costos de tenerlos mal.**
