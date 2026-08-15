export type SolutionBlock = {
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export type CaseOutcome = {
  label: string;
  description: string;
};

export type CaseStudy = {
  slug: string;
  sector: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  challenge: string;
  painPoints: string[];
  solutionSubtitle: string;
  solutionLead: string;
  solutionBlocks: SolutionBlock[];
  outcomes: CaseOutcome[];
  technologies: string[];
  relatedServices: { label: string; href: string }[];
};

export const cases: CaseStudy[] = [
  {
    slug: 'comercio-digital-facturacion-automatica',
    sector: 'Comercio y distribución',
    eyebrow: 'Caso de éxito',
    solutionSubtitle: 'Cinco capas que forman un solo flujo',
    solutionLead: 'Cada componente resuelve una fricción específica y se conecta con los demás para crear un ciclo comercial sin interrupciones manuales.',
    title: 'De cotizaciones manuales a una operación comercial completamente integrada',
    seoTitle: 'Caso de éxito: tienda digital, facturación DIAN y automatización de cotizaciones | Saastreria',
    description:
      'Construimos una plataforma comercial que conecta inteligencia de precios, tienda en línea, cotizaciones automáticas, facturación electrónica DIAN e integración contable en un solo flujo.',
    challenge:
      'La empresa operaba con procesos de venta fragmentados: cotizaciones elaboradas manualmente, sin visibilidad de precios de la competencia, facturación que dependía de digitación redundante y un software contable desconectado del resto de la operación. Cada etapa del ciclo comercial requería intervención manual, lo que limitaba la velocidad de respuesta y generaba errores difíciles de rastrear.',
    painPoints: [
      'Cotizaciones elaboradas manualmente sin referencia de precios actualizada',
      'Sin canal de venta digital propio — dependencia de terceros',
      'Facturación electrónica (DIAN) generada de forma manual y propensa a errores',
      'Software contable desconectado del ciclo de venta',
      'Sin inteligencia de precios sobre ecommerces y proveedores del mercado',
    ],
    solutionBlocks: [
      {
        number: '01',
        title: 'Scraping de precios de ecommerces y proveedores',
        description:
          'Construimos un sistema automatizado de rastreo de precios que extrae y actualiza periódicamente la información de competidores y proveedores en el mercado. Los datos quedan disponibles para consulta interna y alimentan directamente el motor de cotizaciones.',
        tags: ['Web scraping', 'Python', 'ETL', 'Base de datos de precios'],
      },
      {
        number: '02',
        title: 'Tienda digital con pasarela Bold',
        description:
          'Diseñamos y construimos la tienda en línea de la empresa, integrada con Bold como pasarela de pagos para Colombia. El catálogo se alimenta de los datos de productos y precios del sistema centralizado, garantizando coherencia entre los canales.',
        tags: ['E-commerce', 'Bold', 'Catálogo de productos', 'Pagos en línea'],
      },
      {
        number: '03',
        title: 'Automatización del proceso de cotización',
        description:
          'Reemplazamos el flujo manual de cotizaciones con un motor que genera propuestas de precio automáticamente, considerando el inventario disponible, los precios actualizados del mercado y las reglas comerciales de la empresa. El tiempo de respuesta al cliente pasó de horas a minutos.',
        tags: ['Automatización', 'Motor de cotización', 'Reglas de negocio', 'Integración de inventario'],
      },
      {
        number: '04',
        title: 'Facturación electrónica DIAN',
        description:
          'Integramos la generación y transmisión de facturas electrónicas según los requisitos de la DIAN directamente en el flujo de venta. Al confirmar un pedido o cotización aprobada, la factura se genera, valida y envía automáticamente sin intervención manual.',
        tags: ['DIAN', 'Facturación electrónica', 'XML UBL', 'Validación fiscal'],
      },
      {
        number: '05',
        title: 'Integración con software contable',
        description:
          'Conectamos la plataforma con el software contable de la empresa para que cada transacción — venta, factura, cobro — se registre automáticamente sin digitación manual. Esto eliminó la doble entrada de datos y redujo los cierres contables de días a horas.',
        tags: ['Integración contable', 'API', 'Sincronización de transacciones', 'Conciliación automática'],
      },
    ],
    outcomes: [
      {
        label: 'Ciclo de venta acelerado',
        description:
          'La cotización, aprobación y facturación — que antes requerían varios pasos manuales — ahora se completan en un flujo continuo y automatizado.',
      },
      {
        label: 'Inteligencia de precios en tiempo real',
        description:
          'El equipo comercial consulta precios actualizados de la competencia y proveedores sin necesidad de investigación manual.',
      },
      {
        label: 'Cumplimiento DIAN garantizado',
        description:
          'Toda factura se genera con la estructura XML requerida, se transmite y se almacena de forma automática, eliminando el riesgo de inconsistencias.',
      },
      {
        label: 'Impacto directo en facturación',
        description:
          'La combinación de un canal digital propio, cotizaciones rápidas y facturación sin fricciones generó un crecimiento medible en el volumen de facturación de la empresa.',
      },
      {
        label: 'Contabilidad sin doble digitación',
        description:
          'Cada venta registrada en la plataforma se refleja automáticamente en el software contable, cerrando la brecha entre la operación comercial y las finanzas.',
      },
    ],
    technologies: [
      'Python', 'Web scraping', 'Bold', 'API DIAN', 'XML UBL 2.1',
      'PostgreSQL', 'REST APIs', 'Automatización de procesos', 'Integraciones contables',
    ],
    relatedServices: [
      { label: 'Software empresarial a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' },
      { label: 'Automatización de procesos', href: '/soluciones/automatizacion-empresarial/automatizacion-de-procesos/' },
      { label: 'Integración de ERP', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' },
      { label: 'Pipelines de datos', href: '/soluciones/datos-inteligencia-empresarial/pipelines-de-datos/' },
    ],
  },
  {
    slug: 'gestor-documental-legal-datos-abiertos',
    sector: 'Servicios jurídicos',
    eyebrow: 'Caso de éxito',
    solutionSubtitle: 'Seis componentes integrados en una sola plataforma',
    solutionLead: 'La plataforma se construyó de cero para que cada capa — desde la gestión interna hasta la consulta automática a entidades del Estado — funcione como un sistema coherente, no como herramientas aisladas.',
    title: 'Gestor documental legal con integración directa a Rama Judicial, SECOP y Contraloría',
    seoTitle: 'Caso de éxito: gestor documental para abogados con datos abiertos del Estado | Saastreria',
    description:
      'Construimos de cero una plataforma de gestión documental para despachos de abogados que conecta en tiempo real con los datos públicos de la Rama Judicial, el SECOP y la Contraloría, con portal diferenciado para equipo interno y clientes externos, y alertas automáticas por correo y teléfono.',
    challenge:
      'Los despachos de abogados operaban con documentos dispersos en carpetas locales, comunicación de novedades por correo sin trazabilidad y consultas manuales diarias a los portales de la Rama Judicial, el SECOP y la Contraloría para detectar actuaciones relevantes. Cada entidad tiene su propio sistema y sus propias reglas de búsqueda, lo que significaba que un abogado podía pasar horas revisando portales antes de atender un solo cliente. El cliente externo, por su parte, dependía enteramente de que el abogado le comunicara novedades — sin visibilidad propia sobre el estado de su caso.',
    painPoints: [
      'Consulta manual y diaria a Rama Judicial, SECOP y Contraloría — repetitiva y con riesgo de omisiones críticas',
      'Sin portal unificado donde el cliente externo pudiera consultar el estado real de su caso',
      'Comunicación de novedades por correo o WhatsApp sin registro ni trazabilidad',
      'Documentos del caso dispersos entre carpetas locales, correos y sistemas sin versión controlada',
      'Sin alertas automáticas cuando se publican actuaciones judiciales o movimientos en entidades del Estado',
      'Proceso opaco para el cliente — dependía de llamar al abogado para obtener información',
    ],
    solutionBlocks: [
      {
        number: '01',
        title: 'Plataforma de gestión documental construida de cero',
        description:
          'Diseñamos e implementamos el núcleo del sistema: un gestor documental con control de versiones, organización por caso o expediente, permisos por rol y flujos de aprobación. A diferencia de adaptar un sistema genérico, la plataforma refleja exactamente cómo opera un despacho de abogados colombiano — la nomenclatura, los tipos de documento y el ciclo de vida de un caso.',
        tags: ['Plataforma a medida', 'Control de versiones', 'Permisos por rol', 'Expedientes digitales'],
      },
      {
        number: '02',
        title: 'Integración con la Rama Judicial — datos abiertos',
        description:
          'Conectamos la plataforma con los servicios de datos abiertos de la Rama Judicial para que el sistema consulte automáticamente el estado de los procesos judiciales vinculados a cada caso. Las actuaciones, audiencias y cambios de estado se capturan sin intervención manual y quedan registrados en el expediente correspondiente.',
        tags: ['API Rama Judicial', 'Datos abiertos Colombia', 'Procesos judiciales', 'Actuaciones automáticas'],
      },
      {
        number: '03',
        title: 'Integración con SECOP I y II — contratación pública',
        description:
          'Para los clientes con asuntos de contratación estatal, integramos la plataforma con SECOP I y SECOP II. El sistema monitorea procesos, adendas, adjudicaciones y cambios de estado relevantes para cada expediente, sin que el abogado tenga que ingresar manualmente a cada portal.',
        tags: ['SECOP I', 'SECOP II', 'Contratación pública', 'Monitoreo automático'],
      },
      {
        number: '04',
        title: 'Integración con Contraloría General de la República',
        description:
          'Conectamos la consulta de datos de la Contraloría para detectar sanciones, investigaciones de responsabilidad fiscal y publicaciones relevantes que afecten a las partes de un caso. Esta información queda asociada al expediente y genera notificaciones cuando hay novedades.',
        tags: ['Contraloría', 'Responsabilidad fiscal', 'Sanciones', 'Datos públicos'],
      },
      {
        number: '05',
        title: 'Portal dual: equipo interno y cliente externo',
        description:
          'Desarrollamos dos vistas diferenciadas sobre la misma plataforma. El equipo interno accede a la gestión completa del expediente; el cliente externo tiene su propio portal donde puede consultar el estado de su caso, los documentos que le corresponden y las últimas novedades — sin necesidad de llamar ni esperar un correo.',
        tags: ['Portal cliente externo', 'Portal equipo interno', 'Acceso por rol', 'Autoservicio'],
      },
      {
        number: '06',
        title: 'Alertas automáticas por correo y teléfono',
        description:
          'Cuando la plataforma detecta una actuación judicial, una publicación en SECOP, un movimiento en Contraloría o un vencimiento de término, genera automáticamente una alerta dirigida al abogado responsable y, cuando corresponde, al cliente externo. Las alertas se envían por correo electrónico y mensaje de texto, con el contexto necesario para actuar sin necesidad de ingresar al portal.',
        tags: ['Alertas automáticas', 'Correo electrónico', 'SMS', 'Notificaciones en tiempo real'],
      },
    ],
    outcomes: [
      {
        label: 'Detección automática de actuaciones judiciales',
        description:
          'El sistema revisa la Rama Judicial de forma programada y registra los movimientos en el expediente sin consulta manual del abogado.',
      },
      {
        label: 'Cliente informado sin intermediación',
        description:
          'El cliente externo accede a su propio portal para ver el estado del caso, los documentos disponibles y las últimas novedades en tiempo real.',
      },
      {
        label: 'Proceso transparente para todas las partes',
        description:
          'Tanto el equipo jurídico como el cliente tienen visibilidad sobre el caso según su rol, eliminando la dependencia de comunicaciones informales.',
      },
      {
        label: 'Alertas proactivas antes de que venzan términos',
        description:
          'Los vencimientos de términos judiciales y los movimientos en entidades del Estado se comunican automáticamente, sin esperar a que alguien lo detecte.',
      },
      {
        label: 'Expediente completo y trazable en un solo lugar',
        description:
          'Documentos, actuaciones, comunicaciones y novedades de entidades quedan organizados por caso con historial completo y control de versiones.',
      },
      {
        label: 'Eliminación de consultas manuales repetitivas',
        description:
          'La revisión diaria de portales estatales — antes una tarea que consumía horas — pasó a ser un proceso automatizado en segundo plano.',
      },
    ],
    technologies: [
      'Python', 'API Rama Judicial', 'SECOP I y II', 'Contraloría',
      'Datos abiertos Colombia', 'PostgreSQL', 'REST APIs',
      'Portal web', 'Correo electrónico', 'SMS', 'Autenticación por roles',
    ],
    relatedServices: [
      { label: 'Software empresarial a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' },
      { label: 'Automatización de procesos', href: '/soluciones/automatizacion-empresarial/automatizacion-de-procesos/' },
      { label: 'DocFlow — gestión documental', href: '/productos/docflow/' },
      { label: 'Integración de sistemas', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' },
    ],
  },
];
