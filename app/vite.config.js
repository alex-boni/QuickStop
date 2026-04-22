import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Definimos la ruta de la carpeta raíz donde está tu .env
  const envDir = resolve(__dirname, '..');
  
  // 2. Cargamos las variables de entorno de esa carpeta
  // El tercer parámetro '' le dice a Vite que cargue todas las variables, independientemente del prefijo VITE_ (útil para la config del proxy)
  const env = loadEnv(mode, envDir, '');
  
  // 3. Asignamos la variable
  const URL_API = env.VITE_API_URL;

  // 4. Retornamos el objeto de configuración
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          runtimeCaching: [{
            urlPattern: ({url}) => url.origin === 'https://api.mapbox.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }]
        },
        manifest: {
          name: "QuickStop",
          short_name: "QuickStop",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#4f46e5",
          icons: [
            { "src": "icons/appstore.png", "sizes": "192x192", "type": "image/png" },
            { "src": "icons/playstore.png", "sizes": "512x512", "type": "image/png" },
            { "src": "icons/ic_app_512.png", "sizes": "512x512", "type": "image/png" },
            { "src": "icons/ic_app_196.png", "sizes": "196x196", "type": "image/png" },
            { "src": "icons/ic_app_32.png", "sizes": "32x32", "type": "image/png" },
            { "src": "icons/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
          ]
        }
      })
    ],
    // Le indicamos a Vite que busque el .env en la raíz del monorepo
    envDir: envDir,
    server: {
      proxy: {
        '/api': {
          target: URL_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  };
});