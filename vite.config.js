import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt', // Show update prompt to users
        includeAssets: ['icons/*.svg', 'icons/*.png'],
        manifest: false, // We use our own manifest.json in public/
        workbox: {
          // Cache strategies
          runtimeCaching: [
            {
              // Cache API responses
              urlPattern: /^https:\/\/api\.banglade\.sh\/api\/v1\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 // 1 hour
                },
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache weather API (shorter cache)
              urlPattern: /^https:\/\/api\.banglade\.sh\/api\/v1\/portal\/weather.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'weather-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 10 * 60 // 10 minutes
                },
                networkTimeoutSeconds: 5
              }
            },
            {
              // Cache images
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                }
              }
            },
            {
              // Cache fonts
              urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'font-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
              }
            },
            {
              // Cache radio streams metadata (not the actual streams)
              urlPattern: /^https:\/\/cdn-profiles\.tunein\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'radio-logos-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                }
              }
            }
          ],
          // Pre-cache essential assets
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
          // Don't cache large files
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
        },
        devOptions: {
          enabled: true, // Enable PWA in development for testing
          type: 'module'
        }
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: ['banglade.sh', 'www.banglade.sh', 'localhost'],
      watch: {
        usePolling: true, // Needed for Docker volume mounts
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
    },
    define: {
      // Make env variables available at build time
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'http://localhost:8080'),
    },
  }
})
