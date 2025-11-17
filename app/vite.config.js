import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // El Service Worker se actualiza automáticamente
      // output: el archivo Service Worker generado se llamará sw.js
      workbox: {
        // Caching de Assets estáticos (JavaScript, CSS, imágenes)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        // Define la estrategia de caching para assets externos (ej. tiles de Mapbox)
        runtimeCaching: [{
            urlPattern: ({url}) => url.origin === 'https://api.mapbox.com',
            handler: 'CacheFirst', // Cargar de caché primero, luego actualizar
            options: {
                cacheName: 'mapbox-cache',
                expiration: {
                    maxEntries: 50, // Limita el número de ítems
                    maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
                }
            }
        }]
      },
      manifest: {
        name: "QuickStop ParkIT",
        short_name: "QuickStop",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4f46e5",
        icons: [
        {
            "src": "icons/appstore.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/playstore.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "icons/ic_app_512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "icons/ic_app_196.png",
            "sizes": "196x196",
            "type": "image/png"
        }
        ]
      }
    })
  ],
  envDir: resolve(__dirname, '..'),
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // elimina /api para que el backend lo reciba correctamente Ej: http://localhost:3000/api/auth/login -> http://localhost:8080/auth/login
      }
    }
  }
})
