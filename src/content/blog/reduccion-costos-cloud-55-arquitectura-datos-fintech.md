---
title: "Optimización de costos cloud: escenario para una fintech colombiana"
description: "Escenario ilustrativo de auditoría y rediseño de infraestructura para controlar costos cloud sin comprometer la operación."
pubDate: 2026-08-04
author: César Jiménez Arcia
authorLinkedin: https://www.linkedin.com/in/cesar-jimenez-arcia/
image: /og.png
tags: ["Cloud Cost Optimization", "Fintech", "Arquitectura de Datos", "AWS", "Colombia", "Escenario ilustrativo"]
draft: false
---

> **Nota editorial:** este artículo utiliza una fintech y cifras hipotéticas para ilustrar un proceso de optimización. No representa un caso de cliente verificable ni garantiza un porcentaje específico de ahorro.

La fintech procesaba 45.000 transacciones diarias para 120.000 usuarios activos. Su factura en AWS ascendía a $18.000 USD mensuales y crecía al 23% trimestral. El CTO proyectaba que en 18 meses superaría los $40.000 mensuales — un costo inviable para su runway.

El equipo había asumido que escalar el negocio implicaba escalar linealmente el costo de infraestructura. **Esa asunción era incorrecta, y costosa.**

## El Diagnóstico: Dónde Iba el Dinero

La auditoría tomó 2 semanas. El resultado fue sorprendente:

**$18.000 USD/mes distribuidos así:**
- RDS PostgreSQL (instancias): $6.200 (34%)
- S3 + transferencia de datos: $3.800 (21%)
- EC2 (servidores de aplicación): $3.100 (17%)
- Redshift (data warehouse): $2.900 (16%)
- Lambda + API Gateway: $1.100 (6%)
- Otros: $900 (5%)

Los problemas principales que encontramos:

### Problema 1: Instancias RDS Sobredimensionadas
Las instancias de base de datos eran `db.r5.4xlarge` (16 vCPU, 128 GB RAM). El monitoreo de CloudWatch mostró uso promedio de **8% de CPU y 22% de RAM**. Estaban 10 veces sobredimensionadas respecto al uso real.

El sobredimensionamiento original se justificó con "picos de tráfico". Pero los picos reales nunca superaban el 45% de CPU, y solo ocurrían 3-4 veces al día durante 15-20 minutos.

### Problema 2: Datos Calientes en Storage Incorrecto
El 78% de los datos en S3 tenía más de 90 días de antigüedad y se accedía menos de una vez por mes. Estaban en S3 Standard ($0.023/GB) cuando S3 Glacier Instant Retrieval costaba $0.004/GB para ese patrón de acceso.

### Problema 3: Redshift Subutilizado con Datos Duplicados
El data warehouse de Redshift tenía el 60% de datos que también existían en las tablas de RDS. Había sido añadido para reportes analíticos pero la mayoría de esos reportes nunca se construyeron.

### Problema 4: EC2 Always-On para Cargas Batch
Los servidores de procesamiento de transacciones end-of-day corrían 24/7 en EC2 aunque solo procesaban datos 2 horas por noche.

## Las Intervenciones

### Rediseño de Base de Datos: De Always-On a Auto-Scaling

Migramos de instancias RDS fijas a **Aurora Serverless v2**. La diferencia clave: Aurora Serverless escala entre 0.5 y 128 ACUs (unidades de capacidad Aurora) en segundos — se paga solo por lo que se consume.

```
Antes:  db.r5.4xlarge fija = $1.55/hora × 720 horas = $1.116/mes (por instancia)
        × 2 instancias (prod + staging) = $2.232/mes

Después: Aurora Serverless v2
         Promedio real: ~2 ACUs = $0.12/hora × 720 horas = $86.40/mes (por clúster)
         Pico: 32 ACUs = $1.92/hora × 4 picos/día × 0.33 horas × 30 días = $76/mes
         Total estimado: ~$163/mes
```

El ahorro en bases de datos: de $6.200 a ~$900/mes.

La migración tomó un fin de semana con ventana de mantenimiento de 4 horas. Cero pérdida de datos, rollback preparado y no ejecutado.

### Tiering Inteligente en S3

Habilitamos S3 Intelligent-Tiering con las reglas correctas:

```hcl
resource "aws_s3_bucket_lifecycle_configuration" "transacciones" {
  bucket = aws_s3_bucket.transacciones.id

  rule {
    id     = "mover-datos-frios"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_INSTANT_RETRIEVAL"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }
  }
}
```

Para la transferencia de datos: identificamos que el 67% del tráfico de salida era entre servicios AWS en la misma región pero en VPCs distintas (sin VPC peering). Añadir VPC peering eliminó esos cargos de transferencia.

Ahorro en S3: de $3.800 a ~$900/mes.

### Migración de Redshift a BigQuery

Eliminamos Redshift completamente. Los reportes analíticos que sí se usaban (eran 4 dashboards) los migramos a BigQuery con modelo de pago por consulta:

```
Antes: Redshift dc2.8xlarge = $4.80/hora × 720 horas = $3.456/mes

Después: BigQuery
         Almacenamiento activo: 2.3 TB × $0.02/GB = $46/mes
         Consultas: 8 TB procesados/mes × $5/TB = $40/mes
         Total: ~$86/mes
```

Ahorro en analytics: de $2.900 a $86/mes.

### EC2 → Lambda para Cargas Batch

El procesamiento nocturno de 2 horas migró de EC2 `m5.2xlarge` always-on a Lambda con Step Functions:

```
Antes: m5.2xlarge = $0.384/hora × 720 horas = $276/mes

Después: Lambda
         2 horas × 30 días = 60 horas/mes de ejecución real
         Memoria: 3 GB, tiempo promedio 45 min por batch
         Costo Lambda: ~$12/mes
         Step Functions: ~$3/mes
         Total: ~$15/mes
```

## Resultado Final: 55% de Reducción

| Componente | Antes | Después | Ahorro |
|---|---|---|---|
| RDS / Base de datos | $6.200 | $900 | -$5.300 |
| S3 + transferencias | $3.800 | $900 | -$2.900 |
| EC2 | $3.100 | $800 | -$2.300 |
| Redshift → BigQuery | $2.900 | $86 | -$2.814 |
| Lambda + otros | $2.000 | $1.414 | -$586 |
| **Total** | **$18.000** | **$4.100** | **-$13.900** |

La factura final fue $8.100/mes — una reducción del 55% con el mismo nivel de funcionalidad y mejor performance (Aurora Serverless responde más rápido bajo carga variable que la instancia fija sobredimensionada).

## Lo Que Aprendimos

**La sobredimensionamiento inicial no fue un error.** Es la decisión correcta cuando no tienes datos de uso real. El problema es que nadie revisó después.

Las arquitecturas cloud necesitan **revisión activa cada 6 meses**: los patrones de uso cambian, los precios de AWS bajan (hay al menos una reducción de precios al año en algún servicio), y nuevos servicios aparecen.

El costo del proyecto de optimización fue $14.000 USD. El ahorro mensual es $9.900 USD. **ROI en 6 semanas.**
