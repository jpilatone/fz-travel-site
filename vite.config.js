import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://fztravelconsulting.com',
      dynamicRoutes: ['/chi-sono', '/servizi'], // '/' è incluso di default
      changefreq: 'monthly',
      // generateRobotsTxt: true di default -> genera anche robots.txt con la Sitemap
    }),
  ],
})
