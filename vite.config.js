import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Offline-first: precache the whole built shell + bundled content.json.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'mascot.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-512x512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,svg}'],
      },
      manifest: {
        name: 'Gabay — Grade 6 Math',
        short_name: 'Gabay',
        description:
          'Offline-first study companion for Grade 6 Filipino math learners (DepEd MATATAG).',
        theme_color: '#F7D26A',
        background_color: '#FBF1DA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'mascot.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
