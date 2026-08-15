export type UseCase = {
  icon: string;
  title: string;
  description: string;
};

export type Industry = {
  slug: string;
  label: string;
  description: string;
  useCases: UseCase[];
};

export const industries: Industry[] = [
  {
    slug: 'logistica',
    label: 'Logística',
    description: 'Visibilidad, trazabilidad y automatización para operaciones de transporte y distribución.',
    useCases: [
      { icon: '📍', title: 'Rastreo en tiempo real de pedidos', description: 'Panel unificado con estado de cada envío, conductor y vehículo actualizado al instante.' },
      { icon: '🧾', title: 'Cotización automática de fletes', description: 'Motor que calcula tarifas según ruta, peso y transportadora sin intervención manual.' },
      { icon: '📦', title: 'Gestión de inventarios multi-bodega', description: 'Control de stock, movimientos y alertas de mínimos entre varias sedes y bodegas.' },
      { icon: '🔗', title: 'Integración con transportadoras', description: 'Conexión directa con Coordinadora, Servientrega, TCC y otras para sincronizar guías y estados.' },
      { icon: '🗺️', title: 'Optimización y planificación de rutas', description: 'Asignación inteligente de pedidos y rutas según capacidad, distancia y ventanas horarias.' },
      { icon: '🚨', title: 'Alertas de retrasos y excepciones', description: 'Notificaciones automáticas por correo o WhatsApp cuando un envío se desvía del plan.' },
      { icon: '🤝', title: 'Portal de clientes para seguimiento', description: 'Acceso propio para que cada cliente consulte sus pedidos sin contactar al operador.' },
      { icon: '🧮', title: 'Conciliación de guías y facturas', description: 'Cruce automático entre guías despachadas, tarifas pactadas y facturas recibidas.' },
      { icon: '📊', title: 'Reportes de eficiencia por ruta', description: 'Dashboard de costos, tiempos de entrega, novedades y desempeño por conductor y zona.' },
      { icon: '🏭', title: 'Control de flota y mantenimiento', description: 'Historial de mantenimientos, alertas de vencimiento de SOAT, revisiones y documentos.' },
    ],
  },
  {
    slug: 'manufactura',
    label: 'Manufactura',
    description: 'Planta, calidad y gestión empresarial conectados en un solo sistema.',
    useCases: [
      { icon: '🏗️', title: 'Órdenes de producción digitales', description: 'Creación, asignación y seguimiento de órdenes con estado en tiempo real por línea.' },
      { icon: '✅', title: 'Control de calidad con evidencia', description: 'Registro de inspecciones, fotos, firmas y acciones correctivas por lote o turno.' },
      { icon: '🔧', title: 'Mantenimiento preventivo y predictivo', description: 'Plan de mantenimiento con alertas, historial de intervenciones y seguimiento de fallas.' },
      { icon: '🔍', title: 'Trazabilidad de materias primas', description: 'Seguimiento del origen, lote y transformación de cada insumo hasta el producto terminado.' },
      { icon: '📉', title: 'Control de desperdicio y merma', description: 'Registro de pérdidas por línea, turno y material con alertas cuando se superan umbrales.' },
      { icon: '👷', title: 'Gestión de turnos y operarios', description: 'Programación de turnos, asistencia, productividad y novedades por trabajador.' },
      { icon: '📡', title: 'Integración con sensores IoT', description: 'Captura de datos de maquinaria para detectar anomalías y activar alertas sin supervisión manual.' },
      { icon: '🔗', title: 'Integración con ERP de planta', description: 'Sincronización bidireccional con SAP, Siesa u otros ERPs para pedidos, inventario y costos.' },
      { icon: '📊', title: 'Dashboard de producción en tiempo real', description: 'OEE, eficiencia por línea, cumplimiento de plan y principales cuellos de botella visibles.' },
      { icon: '📋', title: 'Digitalización de formularios de planta', description: 'Reemplaza planillas en papel por formularios móviles con validación y firma digital.' },
    ],
  },
  {
    slug: 'servicios-empresariales',
    label: 'Servicios B2B',
    description: 'Operación interna y experiencia del cliente sistematizadas para firmas y consultoras.',
    useCases: [
      { icon: '🗂️', title: 'Portal de clientes con seguimiento de casos', description: 'Cada cliente consulta el estado de su proyecto, documentos y novedades sin llamar.' },
      { icon: '📝', title: 'Automatización de propuestas y cotizaciones', description: 'Generación de propuestas desde plantilla según el tipo de servicio y el cliente.' },
      { icon: '📂', title: 'Gestión documental con aprobaciones', description: 'Control de versiones, flujos de aprobación y búsqueda semántica sobre contratos y entregables.' },
      { icon: '🧾', title: 'Facturación electrónica DIAN', description: 'Generación, validación y envío automático de facturas electrónicas al aprobar un servicio.' },
      { icon: '🤝', title: 'CRM adaptado al proceso B2B', description: 'Pipeline de ventas, seguimiento de oportunidades y gestión de contactos sin herramienta genérica.' },
      { icon: '📅', title: 'Agenda y gestión de reuniones', description: 'Programación automática, recordatorios y registro de acuerdos por cliente y proyecto.' },
      { icon: '💰', title: 'Rentabilidad por cliente y proyecto', description: 'Dashboard de horas, costos, facturación y margen real por cuenta.' },
      { icon: '🔗', title: 'Integración con software contable', description: 'Cada factura, cobro y nota crédito se registra automáticamente sin doble digitación.' },
      { icon: '🚀', title: 'Onboarding digital de nuevos clientes', description: 'Flujo guiado de bienvenida, recolección de datos y firma de contratos en línea.' },
      { icon: '✍️', title: 'Contratos y firmas electrónicas', description: 'Generación de contratos desde plantilla y firma digital con validez legal en Colombia.' },
    ],
  },
  {
    slug: 'salud-y-sst',
    label: 'Salud y SST',
    description: 'Cumplimiento normativo, trazabilidad de actividades e indicadores auditables.',
    useCases: [
      { icon: '🦺', title: 'Sistema de gestión SST (SGSST)', description: 'Plan anual, actividades, responsables, evidencias e indicadores en una sola plataforma.' },
      { icon: '🚑', title: 'Registro y seguimiento de incidentes', description: 'Reporte, investigación, acciones correctivas y cierre con trazabilidad completa.' },
      { icon: '🎓', title: 'Gestión de capacitaciones y competencias', description: 'Plan de formación, asistencia, evaluaciones y vencimiento de certificados por trabajador.' },
      { icon: '🥽', title: 'Control de EPPs y dotación', description: 'Inventario, entrega, renovación y firma de recibido de elementos de protección personal.' },
      { icon: '🏥', title: 'Vigilancia epidemiológica', description: 'Seguimiento de exámenes ocupacionales, restricciones médicas y programas de salud.' },
      { icon: '📋', title: 'Preparación para auditorías', description: 'Documentos, indicadores y evidencias organizados listos para inspección en cualquier momento.' },
      { icon: '📱', title: 'Reporte de riesgos por empleados', description: 'App o formulario móvil para que cualquier trabajador reporte condiciones inseguras.' },
      { icon: '🔗', title: 'Integración con ARL', description: 'Sincronización de accidentes, incapacidades y reportes según los requisitos de la ARL.' },
      { icon: '👷', title: 'Gestión de contratistas y visitantes', description: 'Control de ingreso, verificación de documentos y registro de actividades de terceros en planta.' },
      { icon: '📊', title: 'Indicadores de accidentalidad y ausentismo', description: 'Dashboard de IF, IS, frecuencia y tendencias con alertas automáticas al responsable.' },
    ],
  },
  {
    slug: 'finanzas-y-seguros',
    label: 'Finanzas',
    description: 'Datos, IA y automatización aplicados con seguridad y trazabilidad para el sector financiero.',
    useCases: [
      { icon: '🏦', title: 'Automatización de análisis de crédito', description: 'Motor de scoring que procesa solicitudes y genera conceptos con evidencia trazable.' },
      { icon: '📄', title: 'Gestión documental de pólizas', description: 'Organización, versiones, vencimientos y búsqueda de pólizas y contratos con alertas.' },
      { icon: '🔄', title: 'Conciliación automática de transacciones', description: 'Cruce de movimientos entre fuentes y detección de diferencias sin proceso manual.' },
      { icon: '👤', title: 'Portal de clientes para estados de cuenta', description: 'Cada cliente consulta saldo, movimientos y documentos sin contactar al asesor.' },
      { icon: '📊', title: 'Reportes regulatorios automatizados', description: 'Generación de informes para Superintendencia, UIAF u otras entidades en los formatos requeridos.' },
      { icon: '🔎', title: 'Detección de anomalías en transacciones', description: 'Alertas automáticas sobre comportamientos inusuales en pagos o movimientos de cuentas.' },
      { icon: '🔗', title: 'Integración con centrales de riesgo', description: 'Consulta automática a Datacrédito, TransUnion u otras dentro del flujo de aprobación.' },
      { icon: '📲', title: 'Onboarding digital de clientes', description: 'Vinculación en línea con validación de identidad, biometría y firma de contratos.' },
      { icon: '💡', title: 'Motor de cotización de seguros', description: 'Cálculo automático de primas según variables del riesgo con generación de propuesta.' },
      { icon: '⚖️', title: 'Gestión de siniestros con trazabilidad', description: 'Apertura, documentación, validación y liquidación de siniestros con historial completo.' },
    ],
  },
];
