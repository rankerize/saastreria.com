// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://saastreria.cloud',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const excluded = ['/privacidad/', '/terminos/', '/404/'];
        return !excluded.some((path) => page.includes(path));
      },
      serialize(item) {
        const path = new URL(item.url).pathname;

        if (path === '/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (path === '/diagnostico/') {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }
        // Hubs principales
        if (['/soluciones/', '/industrias/', '/productos/'].includes(path)) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        // Pilares de soluciones (primer nivel bajo /soluciones/)
        const solutionPillars = [
          '/soluciones/datos-inteligencia-empresarial/',
          '/soluciones/modernizacion-integracion-sistemas/',
          '/soluciones/automatizacion-empresarial/',
          '/soluciones/ia-segura-eficiente/',
        ];
        if (solutionPillars.includes(path)) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        if (path === '/blog/') {
          return { ...item, changefreq: 'weekly', priority: 0.7 };
        }
        if (path.startsWith('/blog/')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        // Casos de éxito individuales — contenido de alta conversión
        if (path.startsWith('/casos-de-exito/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        // Sub-páginas de soluciones, industrias, productos, nosotros, etc.
        return { ...item, changefreq: 'monthly', priority: 0.7 };
      },
    }),
  ],
});