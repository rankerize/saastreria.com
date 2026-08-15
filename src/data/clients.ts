export type Client = {
  name: string;
  logo: string;
  sector: string;
  product: string;
  productDetail: string;
  meta: string;
  href: string;
  external: boolean;
  dark: boolean;
  badge?: string;
  review: string;
  reviewService: string;
  reviewRole: string;
};

export const clients: Client[] = [
  {
    name: 'Trujillo Sterling',
    logo: '/clients/trujillo-sterling.webp',
    sector: 'Servicios legales',
    product: 'Plataforma legal en tiempo real',
    productDetail: 'Gestor documental integrado con Rama Judicial, SECOP y Contraloría, con portal de seguimiento para clientes. Su causa es nuestra causa.',
    meta: 'LEGAL · PLATAFORMA A MEDIDA',
    href: '/casos-de-exito/gestor-documental-legal-datos-abiertos/',
    external: false,
    dark: true,
    badge: 'Caso documentado',
    review: 'Como firma que combina derecho tradicional con tecnología e IA, necesitábamos una plataforma a la altura. Saastreria desarrolló nuestro sitio y un sistema digital para que los clientes monitoreen sus procesos legales en tiempo real.',
    reviewService: 'Sitio web + plataforma de seguimiento legal',
    reviewRole: 'TS Abogados · Villavicencio',
  },
  {
    name: 'Proteger IPS',
    logo: '/clients/proteger-ips.webp',
    sector: 'Salud ocupacional',
    product: 'Gestión de exámenes médicos',
    productDetail: 'Plataforma de gestión de exámenes ocupacionales + web institucional, con Saastreria SST como espalda técnica.',
    meta: 'SALUD · SST',
    href: '/productos/saastreria-sst/',
    external: false,
    dark: false,
    review: 'Saastreria digitalizó por completo nuestra gestión de exámenes médicos ocupacionales. El sistema que desarrollaron redujo los tiempos de atención y mejoró la experiencia de cada paciente.',
    reviewService: 'Plataforma de gestión + web institucional',
    reviewRole: 'Salud ocupacional · Bogotá',
  },
  {
    name: 'Transportes Gayco',
    logo: '/clients/gayco.webp',
    sector: 'Logística y transporte',
    product: 'Tracking de flota en tiempo real',
    productDetail: 'Sistema de seguimiento de flota para carga líquida y seca + web corporativa.',
    meta: 'LOGÍSTICA · TELEMETRÍA',
    href: 'https://transportesgayco.com/',
    external: true,
    dark: false,
    review: 'Confeccionaron para nosotros un sistema de seguimiento de flota en tiempo real. La visibilidad sobre nuestra operación mejoró drásticamente.',
    reviewService: 'Sistema de tracking de flota + web',
    reviewRole: 'Transporte de carga líquida y seca',
  },
  {
    name: 'Estarter',
    logo: '/clients/estarter.svg',
    sector: 'Movilidad corporativa',
    product: 'Plataforma de transporte 100% digital',
    productDetail: 'Reservas, seguimiento de conductores y reportes administrativos en una sola herramienta.',
    meta: 'MOVILIDAD · PLATAFORMA DIGITAL',
    href: 'https://estarter.co/',
    external: true,
    dark: false,
    review: 'Saastreria construyó nuestra plataforma 100% digital de transporte corporativo: reservas, seguimiento de conductores y reportes administrativos en una sola herramienta.',
    reviewService: 'Plataforma digital de transporte + web',
    reviewRole: 'Transporte corporativo de pasajeros · Colombia',
  },
  {
    name: 'Sterling & Asociados',
    logo: '/clients/sterling-color.webp',
    sector: 'Auditoría y consultoría',
    product: 'Sitio corporativo + branding',
    productDetail: 'Imagen digital a la altura de una firma de auditores y consultores tributarios.',
    meta: 'AUDITORÍA · WEB + BRANDING',
    href: 'https://sterlingasociados.com/',
    external: true,
    dark: false,
    review: 'Necesitábamos una imagen corporativa a la altura de nuestra firma. Saastreria desarrolló un sitio que transmite exactamente la confianza y el rigor que ofrecemos a nuestros clientes.',
    reviewService: 'Sitio web corporativo + branding digital',
    reviewRole: 'Auditores y consultores tributarios',
  },
];
