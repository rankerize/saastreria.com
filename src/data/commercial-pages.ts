export type FAQItem = { q: string; a: string };

export type CommercialPage = {
  slug: string;
  parentLabel: string;
  parentHref: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  promise: string;
  pains: string[];
  outcomes: string[];
  capabilities: string[];
  process: { title: string; description: string }[];
  useCases: { title: string; description: string }[];
  faq: FAQItem[];
  related: { label: string; href: string }[];
  schemaType?: 'Service' | 'Product';
};

const standardProcess = [
  { title: 'Diagnóstico', description: 'Entendemos el proceso, los usuarios, los datos y los sistemas que intervienen.' },
  { title: 'Diseño', description: 'Definimos alcance, arquitectura, seguridad, indicadores y un primer resultado medible.' },
  { title: 'Implementación', description: 'Construimos e integramos por módulos para reducir riesgo y generar valor temprano.' },
  { title: 'Evolución', description: 'Monitoreamos adopción, calidad, costos y nuevas oportunidades de mejora.' },
];

const commonFAQ = [
  { q: '¿La solución se adapta a nuestros sistemas actuales?', a: 'Sí. El diagnóstico incluye las herramientas y fuentes existentes. Diseñamos integraciones o una migración progresiva según el riesgo y el valor para la operación.' },
  { q: '¿Cómo se define el alcance y el tiempo?', a: 'Después del diagnóstico entregamos una hoja de ruta por etapas, con entregables, dependencias, criterios de aceptación y estimación para cada módulo.' },
  { q: '¿Qué ocurre después de la implementación?', a: 'Podemos acompañar la operación, medir resultados, resolver incidentes y evolucionar la solución conforme cambian los procesos del negocio.' },
];

export const solutionPages: CommercialPage[] = [
  {
    slug: 'datos-inteligencia-empresarial', parentLabel: 'Soluciones', parentHref: '/soluciones/', eyebrow: 'Datos e inteligencia empresarial',
    title: 'Convierte la información de tu empresa en decisiones confiables', seoTitle: 'Datos e inteligencia empresarial | Saastreria',
    description: 'Centralizamos datos, documentos y conocimiento empresarial para consultar, analizar y decidir con seguridad.',
    promise: 'Una capa de inteligencia que conecta la información correcta con las personas autorizadas, en el momento en que la necesitan.',
    pains: ['Información repartida entre hojas de cálculo, ERP, correos y documentos', 'Reportes que tardan días y dependen del equipo técnico', 'Dificultad para saber cuál dato es correcto o quién puede consultarlo'],
    outcomes: ['Fuentes integradas y gobernadas', 'Consultas ejecutivas en lenguaje natural', 'Reportes y alertas con trazabilidad', 'Acceso definido por roles y permisos'],
    capabilities: ['Enterprise RAG', 'Business Intelligence agéntico', 'Text-to-SQL', 'Pipelines y calidad de datos', 'Data Lakes y Warehouses', 'Gobierno y catálogo de información'],
    process: standardProcess,
    useCases: [
      { title: 'Asistente de conocimiento interno', description: 'Responde sobre políticas, contratos y procedimientos citando la fuente autorizada.' },
      { title: 'Inteligencia para dirección', description: 'Permite consultar ventas, costos, inventarios y operación sin esperar un reporte manual.' },
      { title: 'Calidad y trazabilidad', description: 'Detecta inconsistencias y registra el origen, transformación y uso de la información.' },
    ],
    faq: commonFAQ,
    related: [
      { label: 'Enterprise RAG', href: '/soluciones/datos-inteligencia-empresarial/enterprise-rag/' },
      { label: 'BI agéntico', href: '/soluciones/datos-inteligencia-empresarial/business-intelligence-agentico/' },
      { label: 'Pipelines de datos', href: '/soluciones/datos-inteligencia-empresarial/pipelines-de-datos/' },
    ], schemaType: 'Service',
  },
  {
    slug: 'datos-inteligencia-empresarial/enterprise-rag', parentLabel: 'Datos e inteligencia', parentHref: '/soluciones/datos-inteligencia-empresarial/', eyebrow: 'Enterprise RAG',
    title: 'IA empresarial que responde usando tus datos y muestra sus fuentes', seoTitle: 'Enterprise RAG para empresas | Saastreria',
    description: 'Construimos sistemas RAG conectados con documentos, bases de datos y aplicaciones, con permisos y trazabilidad.',
    promise: 'Respuestas útiles y verificables sobre el conocimiento real de la organización, sin exponer información a usuarios no autorizados.',
    pains: ['Documentos difíciles de encontrar', 'Asistentes que responden sin evidencia', 'Conocimiento crítico concentrado en pocas personas'],
    outcomes: ['Respuestas con citas y contexto', 'Permisos por usuario o área', 'Evaluaciones de calidad y observabilidad', 'Integración con fuentes existentes'],
    capabilities: ['Búsqueda híbrida y semántica', 'pgvector y bases vectoriales', 'Conectores documentales', 'Reranking', 'Evaluación de respuestas', 'Auditoría de consultas'],
    process: standardProcess,
    useCases: [
      { title: 'Consulta de procedimientos', description: 'Los equipos encuentran instrucciones vigentes sin recorrer carpetas y versiones.' },
      { title: 'Soporte interno', description: 'Un asistente resuelve preguntas frecuentes y escala únicamente los casos necesarios.' },
      { title: 'Análisis contractual', description: 'Localiza cláusulas y diferencias manteniendo el vínculo con el documento original.' },
    ], faq: commonFAQ,
    related: [{ label: 'Seguridad y gobierno de IA', href: '/soluciones/ia-segura-eficiente/seguridad-y-gobierno-de-ia/' }, { label: 'Pipelines de datos', href: '/soluciones/datos-inteligencia-empresarial/pipelines-de-datos/' }], schemaType: 'Service',
  },
  {
    slug: 'datos-inteligencia-empresarial/business-intelligence-agentico', parentLabel: 'Datos e inteligencia', parentHref: '/soluciones/datos-inteligencia-empresarial/', eyebrow: 'Business Intelligence agéntico',
    title: 'Haz preguntas al negocio y recibe análisis trazables', seoTitle: 'Business Intelligence agéntico y Text-to-SQL | Saastreria',
    description: 'Creamos asistentes analíticos capaces de interpretar preguntas, consultar datos autorizados y explicar sus resultados.',
    promise: 'Más autonomía para líderes y analistas, con controles que protegen las bases de datos y la consistencia de las métricas.',
    pains: ['Acumulación de solicitudes al equipo de datos', 'Métricas distintas entre áreas', 'Consultas manuales que retrasan decisiones'],
    outcomes: ['Preguntas en lenguaje natural', 'SQL validado y limitado', 'Métricas gobernadas', 'Explicaciones y visualizaciones claras'],
    capabilities: ['Text-to-SQL', 'Capa semántica', 'Catálogo de métricas', 'Controles de consulta', 'Dashboards y alertas', 'Registro de auditoría'],
    process: standardProcess,
    useCases: [{ title: 'Análisis comercial', description: 'Ventas, margen y desempeño por canal disponibles para líderes autorizados.' }, { title: 'Control operativo', description: 'Consultas sobre tiempos, capacidad y excepciones sin crear reportes manuales.' }, { title: 'Finanzas', description: 'Exploración controlada de variaciones, presupuestos y costos.' }],
    faq: commonFAQ, related: [{ label: 'Pipelines de datos', href: '/soluciones/datos-inteligencia-empresarial/pipelines-de-datos/' }, { label: 'IA segura', href: '/soluciones/ia-segura-eficiente/' }], schemaType: 'Service',
  },
  {
    slug: 'datos-inteligencia-empresarial/pipelines-de-datos', parentLabel: 'Datos e inteligencia', parentHref: '/soluciones/datos-inteligencia-empresarial/', eyebrow: 'Ingeniería de datos',
    title: 'Datos disponibles, confiables y preparados para crecer', seoTitle: 'Pipelines de datos empresariales | Saastreria',
    description: 'Diseñamos pipelines, integraciones y controles de calidad para que la información llegue completa y a tiempo.',
    promise: 'Una base de datos operativa y analítica que no dependa de procesos manuales frágiles.',
    pains: ['Carga manual de archivos', 'Datos duplicados o incompletos', 'Procesos que fallan sin alertas'],
    outcomes: ['Flujos automatizados y observables', 'Reglas de calidad', 'Historial y linaje', 'Escalabilidad por demanda'],
    capabilities: ['ETL y ELT', 'Orquestación', 'Streaming', 'Data Warehouses', 'Pruebas de calidad', 'Monitoreo de costos'],
    process: standardProcess,
    useCases: [{ title: 'Consolidación de ERP y CRM', description: 'Unifica información comercial y operativa para análisis consistente.' }, { title: 'Inventario actualizado', description: 'Sincroniza movimientos y alertas entre sedes y aplicaciones.' }, { title: 'Plataforma de datos', description: 'Prepara una base gobernada para BI, automatización e IA.' }],
    faq: commonFAQ, related: [{ label: 'Integración de ERP', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' }, { label: 'Procesamiento en tiempo real', href: '/soluciones/automatizacion-empresarial/procesamiento-en-tiempo-real/' }], schemaType: 'Service',
  },
  {
    slug: 'modernizacion-integracion-sistemas', parentLabel: 'Soluciones', parentHref: '/soluciones/', eyebrow: 'Modernización e integración',
    title: 'Moderniza la tecnología sin detener la operación', seoTitle: 'Modernización e integración de sistemas | Saastreria',
    description: 'Actualizamos software, conectamos sistemas y desarrollamos plataformas internas alrededor de tus procesos.',
    promise: 'Reducir deuda técnica y fragmentación con una transición progresiva, documentada y alineada con el negocio.',
    pains: ['Sistemas antiguos difíciles de mantener', 'Información duplicada entre aplicaciones', 'Software genérico que no refleja la operación'],
    outcomes: ['Arquitectura moderna y mantenible', 'Integraciones confiables', 'Procesos unificados', 'Menor riesgo operativo'],
    capabilities: ['Software empresarial a medida', 'Modernización legacy', 'Integración de ERP', 'APIs y middleware', 'Migración cloud', 'Pruebas y documentación'],
    process: standardProcess,
    useCases: [{ title: 'Plataformas internas', description: 'Sistemas para inventarios, personal, contabilidad y operación.' }, { title: 'Migración progresiva', description: 'Reemplazo modular de aplicaciones antiguas sin una reescritura total.' }, { title: 'Integración empresarial', description: 'Conectores entre ERP, CRM, portales y herramientas propias.' }],
    faq: commonFAQ,
    related: [{ label: 'Software a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' }, { label: 'Modernización legacy', href: '/soluciones/modernizacion-integracion-sistemas/modernizacion-de-software-legacy/' }, { label: 'Integración de ERP', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' }], schemaType: 'Service',
  },
  {
    slug: 'modernizacion-integracion-sistemas/software-empresarial-a-medida', parentLabel: 'Modernización e integración', parentHref: '/soluciones/modernizacion-integracion-sistemas/', eyebrow: 'Software a medida',
    title: 'Software construido alrededor de la forma real de trabajar de tu empresa', seoTitle: 'Software empresarial a medida | Saastreria',
    description: 'Diseñamos plataformas internas para gestionar procesos, información, permisos e indicadores específicos del negocio.',
    promise: 'Tu equipo no tiene que adaptarse a un programa genérico: la solución refleja las reglas y responsabilidades de la operación.',
    pains: ['Dependencia excesiva de Excel y WhatsApp', 'Procesos que el software actual no soporta', 'Falta de trazabilidad y control'],
    outcomes: ['Flujos adaptados al negocio', 'Permisos por rol', 'Indicadores en tiempo real', 'Integraciones con sistemas actuales'],
    capabilities: ['Portales internos', 'Inventarios y activos', 'Gestión de personal', 'Operaciones y aprobaciones', 'Reportes gerenciales', 'Aplicaciones web y móviles'],
    process: standardProcess,
    useCases: [{ title: 'Gestión de inventarios', description: 'Movimientos, ubicaciones, alertas, responsables y auditoría.' }, { title: 'Operación y aprobaciones', description: 'Solicitudes, reglas, responsables y evidencia en un solo flujo.' }, { title: 'Gestión de personal', description: 'Documentos, novedades, formación y seguimiento por rol.' }],
    faq: commonFAQ, related: [{ label: 'Automatización de procesos', href: '/soluciones/automatizacion-empresarial/automatizacion-de-procesos/' }, { label: 'Integración de ERP', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' }], schemaType: 'Service',
  },
  {
    slug: 'modernizacion-integracion-sistemas/modernizacion-de-software-legacy', parentLabel: 'Modernización e integración', parentHref: '/soluciones/modernizacion-integracion-sistemas/', eyebrow: 'Modernización legacy',
    title: 'Evoluciona sistemas críticos sin una reescritura riesgosa', seoTitle: 'Modernización de software legacy | Saastreria',
    description: 'Auditamos y modernizamos aplicaciones antiguas por módulos, conservando continuidad y conocimiento operativo.',
    promise: 'Una transición controlada con pruebas, documentación y puntos de reversión claros.',
    pains: ['Cambios que generan miedo e incidentes', 'Tecnologías sin soporte', 'Conocimiento concentrado en pocas personas'],
    outcomes: ['Mapa de dependencias', 'Cobertura de pruebas', 'Módulos modernos', 'Documentación transferible'],
    capabilities: ['Auditoría de código', 'Strangler pattern', 'Extracción de APIs', 'Migración cloud', 'Pruebas automatizadas', 'Observabilidad'],
    process: standardProcess,
    useCases: [{ title: 'Monolito empresarial', description: 'Extracción progresiva de capacidades críticas hacia servicios mantenibles.' }, { title: 'Aplicaciones sin soporte', description: 'Actualización de runtime, dependencias y controles de seguridad.' }, { title: 'Migración de infraestructura', description: 'Preparación y transición hacia entornos modernos con medición.' }],
    faq: commonFAQ, related: [{ label: 'Software a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' }, { label: 'Integración de ERP', href: '/soluciones/modernizacion-integracion-sistemas/integracion-de-erp/' }], schemaType: 'Service',
  },
  {
    slug: 'modernizacion-integracion-sistemas/integracion-de-erp', parentLabel: 'Modernización e integración', parentHref: '/soluciones/modernizacion-integracion-sistemas/', eyebrow: 'Integración empresarial',
    title: 'Conecta ERP, CRM y aplicaciones sin duplicar trabajo', seoTitle: 'Integración de ERP y sistemas empresariales | Saastreria',
    description: 'Construimos APIs, middleware y sincronizaciones observables entre los sistemas que sostienen la operación.',
    promise: 'La información fluye entre herramientas con reglas claras, reintentos y trazabilidad.',
    pains: ['Digitación repetida', 'Datos diferentes entre sistemas', 'Integraciones frágiles sin monitoreo'],
    outcomes: ['Sincronización automática', 'Menos errores manuales', 'Alertas y reintentos', 'Historial de transacciones'],
    capabilities: ['APIs REST y eventos', 'Middleware', 'Webhooks', 'Mapeo de datos', 'Colas y reintentos', 'Monitoreo'],
    process: standardProcess,
    useCases: [{ title: 'ERP y comercio', description: 'Sincronización de productos, pedidos, facturación e inventarios.' }, { title: 'CRM y operación', description: 'Transferencia controlada de clientes, oportunidades y tareas.' }, { title: 'Nómina y personal', description: 'Integración de novedades, documentos y aprobaciones.' }],
    faq: commonFAQ, related: [{ label: 'Pipelines de datos', href: '/soluciones/datos-inteligencia-empresarial/pipelines-de-datos/' }, { label: 'Automatización', href: '/soluciones/automatizacion-empresarial/' }], schemaType: 'Service',
  },
  {
    slug: 'automatizacion-empresarial', parentLabel: 'Soluciones', parentHref: '/soluciones/', eyebrow: 'Automatización empresarial',
    title: 'Automatiza procesos completos sin perder control', seoTitle: 'Automatización empresarial e IA | Saastreria',
    description: 'Diseñamos flujos, sistemas y agentes que reducen tareas repetitivas y conectan personas, datos y decisiones.',
    promise: 'Automatizaciones observables que respetan reglas, permisos y excepciones reales del negocio.',
    pains: ['Tareas repetitivas que consumen al equipo', 'Solicitudes sin seguimiento', 'Errores de copia y validación'],
    outcomes: ['Menos trabajo manual', 'Tiempos de respuesta predecibles', 'Alertas y escalamiento', 'Trazabilidad por proceso'],
    capabilities: ['Agentes empresariales', 'Automatización de procesos', 'Orquestación de flujos', 'Procesamiento documental', 'Eventos en tiempo real', 'Integraciones'],
    process: standardProcess,
    useCases: [{ title: 'Back office', description: 'Recepción, validación, clasificación y registro de solicitudes.' }, { title: 'Operación', description: 'Asignación, seguimiento, alertas y escalamiento de actividades.' }, { title: 'Documentos', description: 'Extracción de información y rutas de aprobación con evidencia.' }],
    faq: commonFAQ,
    related: [{ label: 'Agentes empresariales', href: '/soluciones/automatizacion-empresarial/agentes-de-ia-empresariales/' }, { label: 'Automatización de procesos', href: '/soluciones/automatizacion-empresarial/automatizacion-de-procesos/' }, { label: 'Tiempo real', href: '/soluciones/automatizacion-empresarial/procesamiento-en-tiempo-real/' }], schemaType: 'Service',
  },
  {
    slug: 'automatizacion-empresarial/agentes-de-ia-empresariales', parentLabel: 'Automatización empresarial', parentHref: '/soluciones/automatizacion-empresarial/', eyebrow: 'Agentes empresariales',
    title: 'Agentes que consultan, coordinan y actúan dentro de límites definidos', seoTitle: 'Agentes de IA empresariales | Saastreria',
    description: 'Creamos agentes conectados con datos y herramientas internas, con aprobación humana y registros de auditoría.',
    promise: 'IA que ayuda a ejecutar trabajo real sin convertirse en una caja negra.',
    pains: ['Asistentes aislados de la operación', 'Tareas que requieren consultar varias herramientas', 'Riesgo de acciones sin supervisión'],
    outcomes: ['Acciones controladas', 'Aprobación humana configurable', 'Registro de cada decisión', 'Integración con sistemas internos'],
    capabilities: ['Tool calling', 'Memoria controlada', 'Orquestación multiagente', 'Aprobaciones', 'Evaluación', 'Observabilidad'],
    process: standardProcess,
    useCases: [{ title: 'Agente operativo', description: 'Consulta estados, prepara acciones y solicita aprobación cuando corresponde.' }, { title: 'Agente de soporte interno', description: 'Resuelve preguntas y ejecuta tareas permitidas en sistemas autorizados.' }, { title: 'Agente analítico', description: 'Investiga anomalías y presenta evidencia antes de recomendar una acción.' }],
    faq: commonFAQ, related: [{ label: 'Enterprise RAG', href: '/soluciones/datos-inteligencia-empresarial/enterprise-rag/' }, { label: 'Seguridad de IA', href: '/soluciones/ia-segura-eficiente/seguridad-y-gobierno-de-ia/' }], schemaType: 'Service',
  },
  {
    slug: 'automatizacion-empresarial/automatizacion-de-procesos', parentLabel: 'Automatización empresarial', parentHref: '/soluciones/automatizacion-empresarial/', eyebrow: 'Sistematización de procesos',
    title: 'Convierte procesos manuales en flujos medibles y escalables', seoTitle: 'Automatización de procesos empresariales | Saastreria',
    description: 'Mapeamos el proceso actual y automatizamos tareas, validaciones, aprobaciones, alertas y reportes.',
    promise: 'Cada automatización parte de entender el proceso, no de imponer una herramienta.',
    pains: ['Dependencia de correos y mensajes', 'Aprobaciones sin trazabilidad', 'Reportes construidos manualmente'],
    outcomes: ['Flujos estandarizados', 'Responsables visibles', 'Indicadores automáticos', 'Gestión de excepciones'],
    capabilities: ['BPM y workflows', 'Integraciones', 'Procesamiento documental', 'Notificaciones', 'Reglas de negocio', 'Dashboards'],
    process: standardProcess,
    useCases: [{ title: 'Compras y aprobaciones', description: 'Solicitudes con reglas, responsables, evidencia y tiempos.' }, { title: 'Gestión de SST', description: 'Seguimiento de actividades, incidentes, documentos e indicadores.' }, { title: 'Novedades de personal', description: 'Recepción, validación y actualización en sistemas internos.' }],
    faq: commonFAQ, related: [{ label: 'Software a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' }, { label: 'Agentes empresariales', href: '/soluciones/automatizacion-empresarial/agentes-de-ia-empresariales/' }], schemaType: 'Service',
  },
  {
    slug: 'automatizacion-empresarial/procesamiento-en-tiempo-real', parentLabel: 'Automatización empresarial', parentHref: '/soluciones/automatizacion-empresarial/', eyebrow: 'Eventos y Edge AI',
    title: 'Responde a eventos operativos cuando todavía puedes actuar', seoTitle: 'Procesamiento de datos en tiempo real y Edge AI | Saastreria',
    description: 'Implementamos eventos, streaming e inteligencia en el borde para operaciones que no pueden esperar un proceso por lotes.',
    promise: 'Detectar, decidir y activar respuestas cerca del momento en que ocurre el evento.',
    pains: ['Alertas que llegan demasiado tarde', 'Equipos desconectados o con conectividad limitada', 'Datos operativos que no activan acciones'],
    outcomes: ['Eventos procesados en tiempo real', 'Alertas contextuales', 'Operación resiliente', 'Menor latencia'],
    capabilities: ['Kafka y streaming', 'IoT', 'Edge AI', 'Procesamiento de eventos', 'SLMs', 'Observabilidad'],
    process: standardProcess,
    useCases: [{ title: 'Manufactura', description: 'Detección de condiciones y anomalías cerca de la línea de producción.' }, { title: 'Logística', description: 'Eventos de ubicación, temperatura, capacidad y cumplimiento.' }, { title: 'Energía', description: 'Monitoreo distribuido y alertas con conectividad variable.' }],
    faq: commonFAQ, related: [{ label: 'Manufactura', href: '/industrias/manufactura/' }, { label: 'Logística', href: '/industrias/logistica/' }], schemaType: 'Service',
  },
  {
    slug: 'ia-segura-eficiente', parentLabel: 'Soluciones', parentHref: '/soluciones/', eyebrow: 'IA segura y eficiente',
    title: 'Implementa inteligencia artificial con control, evidencia y costos sostenibles', seoTitle: 'IA segura, LLMOps y optimización de costos | Saastreria',
    description: 'Diseñamos controles, evaluaciones y observabilidad para operar IA empresarial de manera confiable.',
    promise: 'Pasar de una prueba llamativa a una capacidad empresarial gobernada y medible.',
    pains: ['Respuestas difíciles de verificar', 'Datos sensibles sin controles claros', 'Facturas de modelos que crecen sin visibilidad'],
    outcomes: ['Políticas y permisos', 'Evaluaciones continuas', 'Observabilidad de calidad y costos', 'Selección eficiente de modelos'],
    capabilities: ['Guardrails', 'LLMOps', 'Gobierno de IA', 'Evaluación', 'Seguridad', 'AI Cost Ops'],
    process: standardProcess,
    useCases: [{ title: 'IA regulada', description: 'Controles y evidencia para casos con información sensible.' }, { title: 'Operación de modelos', description: 'Monitoreo de calidad, latencia, uso y fallos.' }, { title: 'Optimización', description: 'Ruteo de modelos, caché y presupuestos por caso de uso.' }],
    faq: commonFAQ,
    related: [{ label: 'Seguridad y gobierno', href: '/soluciones/ia-segura-eficiente/seguridad-y-gobierno-de-ia/' }, { label: 'LLMOps', href: '/soluciones/ia-segura-eficiente/llmops-empresarial/' }, { label: 'Optimización de costos', href: '/soluciones/ia-segura-eficiente/optimizacion-de-costos-de-ia/' }], schemaType: 'Service',
  },
  {
    slug: 'ia-segura-eficiente/seguridad-y-gobierno-de-ia', parentLabel: 'IA segura y eficiente', parentHref: '/soluciones/ia-segura-eficiente/', eyebrow: 'Gobierno de IA',
    title: 'Define qué puede hacer la IA, con qué datos y bajo qué controles', seoTitle: 'Seguridad y gobierno de inteligencia artificial | Saastreria',
    description: 'Implementamos permisos, políticas, guardrails, auditoría y evaluación para aplicaciones empresariales de IA.',
    promise: 'Reducir riesgos sin bloquear la adopción útil de inteligencia artificial.',
    pains: ['Datos confidenciales expuestos', 'Respuestas sin evidencia', 'Falta de responsables y políticas'],
    outcomes: ['Controles por caso de uso', 'Auditoría y trazabilidad', 'Evaluaciones de riesgo', 'Aprobación humana'],
    capabilities: ['Control de acceso', 'Protección de datos', 'Guardrails', 'Red teaming', 'Evaluación', 'Políticas de uso'],
    process: standardProcess,
    useCases: [{ title: 'Asistentes internos', description: 'Acceso condicionado por identidad, rol y fuente.' }, { title: 'Procesamiento sensible', description: 'Enmascaramiento, límites de retención y registros verificables.' }, { title: 'Acciones automatizadas', description: 'Autorizaciones y supervisión según el impacto de cada acción.' }],
    faq: commonFAQ, related: [{ label: 'Enterprise RAG', href: '/soluciones/datos-inteligencia-empresarial/enterprise-rag/' }, { label: 'LLMOps', href: '/soluciones/ia-segura-eficiente/llmops-empresarial/' }], schemaType: 'Service',
  },
  {
    slug: 'ia-segura-eficiente/llmops-empresarial', parentLabel: 'IA segura y eficiente', parentHref: '/soluciones/ia-segura-eficiente/', eyebrow: 'LLMOps',
    title: 'Opera aplicaciones de IA con la disciplina de un sistema crítico', seoTitle: 'LLMOps empresarial y observabilidad de IA | Saastreria',
    description: 'Medimos calidad, latencia, costos, versiones y comportamiento para evolucionar aplicaciones de IA con evidencia.',
    promise: 'Saber qué está funcionando, qué cambió y cuándo intervenir.',
    pains: ['Cambios de modelo sin medición', 'Errores que solo reportan los usuarios', 'Ausencia de datos sobre calidad y costo'],
    outcomes: ['Trazas completas', 'Evaluaciones automáticas', 'Versionado y pruebas', 'Alertas operativas'],
    capabilities: ['Observabilidad', 'Prompt y model registry', 'Evals', 'Trazas', 'Canary releases', 'Monitoreo de calidad'],
    process: standardProcess,
    useCases: [{ title: 'RAG en producción', description: 'Seguimiento de recuperación, evidencia y utilidad de respuestas.' }, { title: 'Agentes', description: 'Trazabilidad de herramientas, decisiones, errores y aprobaciones.' }, { title: 'Cambio de modelos', description: 'Comparación controlada antes de modificar el comportamiento productivo.' }],
    faq: commonFAQ, related: [{ label: 'Seguridad y gobierno', href: '/soluciones/ia-segura-eficiente/seguridad-y-gobierno-de-ia/' }, { label: 'Optimización de costos', href: '/soluciones/ia-segura-eficiente/optimizacion-de-costos-de-ia/' }], schemaType: 'Service',
  },
  {
    slug: 'ia-segura-eficiente/optimizacion-de-costos-de-ia', parentLabel: 'IA segura y eficiente', parentHref: '/soluciones/ia-segura-eficiente/', eyebrow: 'AI Cost Ops',
    title: 'Controla el costo de IA sin sacrificar la experiencia', seoTitle: 'Optimización de costos de inteligencia artificial | Saastreria',
    description: 'Analizamos consumo, modelos, caché e infraestructura para asignar cada tarea a la opción adecuada.',
    promise: 'Visibilidad y reglas financieras para que el costo crezca con el valor, no con la improvisación.',
    pains: ['Uso del modelo más costoso para todas las tareas', 'Consumo sin presupuesto por área', 'Prompts y contexto sobredimensionados'],
    outcomes: ['Costo por flujo y usuario', 'Ruteo inteligente', 'Caché y reutilización', 'Presupuestos y alertas'],
    capabilities: ['FinOps de IA', 'Model routing', 'Caché semántica', 'Optimización de contexto', 'Batching', 'Dashboards de consumo'],
    process: standardProcess,
    useCases: [{ title: 'Asistentes de alto volumen', description: 'Clasificación de tareas y selección dinámica de modelos.' }, { title: 'Procesamiento documental', description: 'Lotes, caché y modelos especializados por tipo de documento.' }, { title: 'Control financiero', description: 'Presupuestos, alertas y atribución de costos por unidad.' }],
    faq: commonFAQ, related: [{ label: 'LLMOps', href: '/soluciones/ia-segura-eficiente/llmops-empresarial/' }, { label: 'Agentes empresariales', href: '/soluciones/automatizacion-empresarial/agentes-de-ia-empresariales/' }], schemaType: 'Service',
  },
];

export const industryPages: CommercialPage[] = [
  ['logistica', 'Logística', 'Integra inventarios, trazabilidad y decisiones operativas en tiempo real', ['Inventarios desconectados', 'Trazabilidad manual', 'Alertas tardías'], ['Visibilidad de punta a punta', 'Eventos y alertas', 'Integración con ERP y transporte'], ['Control de inventarios', 'Trazabilidad', 'Integración ERP', 'Analítica operativa']],
  ['manufactura', 'Manufactura', 'Conecta planta, mantenimiento, calidad y gestión empresarial', ['Datos aislados de planta', 'Mantenimiento reactivo', 'Reportes manuales'], ['Información operacional integrada', 'Alertas tempranas', 'Trazabilidad de calidad'], ['IoT y Edge AI', 'Mantenimiento', 'Calidad', 'Integración de sistemas']],
  ['servicios-empresariales', 'Servicios empresariales', 'Sistematiza la operación y entrega una experiencia consistente al cliente', ['Solicitudes por múltiples canales', 'Aprobaciones lentas', 'Poca trazabilidad'], ['Flujos estandarizados', 'Portales internos', 'Indicadores de servicio'], ['Software a medida', 'Automatización', 'Gestión documental', 'BI']],
  ['salud-y-sst', 'Salud y SST', 'Organiza documentos, actividades e indicadores con trazabilidad', ['Documentación dispersa', 'Seguimientos manuales', 'Dificultad para demostrar ejecución'], ['Expedientes organizados', 'Alertas y responsables', 'Indicadores auditables'], ['SST', 'Gestión documental', 'Flujos de aprobación', 'Datos seguros']],
  ['finanzas-y-seguros', 'Finanzas y seguros', 'Aplica datos e IA con seguridad, evidencia y control', ['Procesos documentales intensivos', 'Datos sensibles', 'Decisiones difíciles de auditar'], ['Automatización controlada', 'Trazabilidad', 'Gobierno de IA'], ['RAG seguro', 'Procesamiento documental', 'LLMOps', 'Integraciones']],
].map(([slug, name, title, pains, outcomes, capabilities]) => ({
  slug: slug as string, parentLabel: 'Industrias', parentHref: '/industrias/', eyebrow: `Soluciones para ${name}`,
  title: title as string, seoTitle: `Soluciones tecnológicas para ${name} | Saastreria`,
  description: `Software, datos, automatización e inteligencia artificial aplicados a procesos de ${String(name).toLowerCase()}.`,
  promise: `Combinamos capacidades técnicas según las necesidades operativas y regulatorias de ${String(name).toLowerCase()}.`,
  pains: pains as string[], outcomes: outcomes as string[], capabilities: capabilities as string[], process: standardProcess,
  useCases: (capabilities as string[]).slice(0, 3).map((item) => ({ title: item, description: `Diseño e implementación adaptados a los procesos, sistemas y responsables de la organización.` })),
  faq: commonFAQ,
  related: [{ label: 'Software a medida', href: '/soluciones/modernizacion-integracion-sistemas/software-empresarial-a-medida/' }, { label: 'Automatización empresarial', href: '/soluciones/automatizacion-empresarial/' }, { label: 'Datos e inteligencia', href: '/soluciones/datos-inteligencia-empresarial/' }],
  schemaType: 'Service' as const,
}));

export const productPages: CommercialPage[] = [
  {
    slug: 'saastreria-sst', parentLabel: 'Productos', parentHref: '/productos/', eyebrow: 'Saastreria SST', title: 'Gestión de SST organizada, trazable y preparada para auditoría', seoTitle: 'Software de gestión SST para empresas | Saastreria',
    description: 'Plataforma para centralizar actividades, incidentes, documentos, responsables e indicadores del SGSST.', promise: 'Menos hojas dispersas y más control sobre la ejecución del sistema de seguridad y salud en el trabajo.',
    pains: ['Documentos y evidencias en múltiples carpetas', 'Actividades sin responsables visibles', 'Indicadores construidos manualmente'], outcomes: ['Plan de trabajo centralizado', 'Alertas y responsables', 'Evidencia organizada', 'Indicadores actualizados'],
    capabilities: ['Plan anual', 'Incidentes y accidentes', 'Gestión documental', 'Indicadores', 'Multiempresa y multisede', 'Roles y auditoría'], process: standardProcess,
    useCases: [{ title: 'Plan de trabajo', description: 'Actividades, responsables, fechas, avance y evidencia en un solo lugar.' }, { title: 'Gestión de incidentes', description: 'Registro, investigación, acciones y seguimiento trazable.' }, { title: 'Preparación de auditoría', description: 'Documentos e indicadores organizados para consulta.' }], faq: commonFAQ,
    related: [{ label: 'Automatización de procesos', href: '/soluciones/automatizacion-empresarial/automatizacion-de-procesos/' }, { label: 'Salud y SST', href: '/industrias/salud-y-sst/' }], schemaType: 'Product',
  },
  {
    slug: 'docflow', parentLabel: 'Productos', parentHref: '/productos/', eyebrow: 'DocFlow', title: 'Documentos, versiones y aprobaciones bajo control', seoTitle: 'Gestión documental empresarial DocFlow | Saastreria',
    description: 'Sistema de gestión documental con control de versiones, búsqueda, permisos y flujos de aprobación.', promise: 'Un punto confiable para encontrar la versión correcta y saber quién revisó, aprobó o modificó cada documento.',
    pains: ['Versiones duplicadas', 'Aprobaciones por correo', 'Dificultad para encontrar documentos'], outcomes: ['Versión vigente identificable', 'Flujos de aprobación', 'Permisos por rol', 'Búsqueda semántica'],
    capabilities: ['Control de versiones', 'Aprobaciones', 'Búsqueda', 'Permisos', 'Auditoría', 'Integraciones'], process: standardProcess,
    useCases: [{ title: 'Procedimientos', description: 'Creación, revisión, aprobación y publicación de documentos vigentes.' }, { title: 'Contratos', description: 'Organización, búsqueda y trazabilidad de cambios y responsables.' }, { title: 'Calidad', description: 'Evidencias, políticas y documentación controlada por proceso.' }], faq: commonFAQ,
    related: [{ label: 'Enterprise RAG', href: '/soluciones/datos-inteligencia-empresarial/enterprise-rag/' }, { label: 'Servicios empresariales', href: '/industrias/servicios-empresariales/' }], schemaType: 'Product',
  },
];
