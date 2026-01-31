import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
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
