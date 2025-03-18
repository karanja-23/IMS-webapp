import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8000,
    cors: true,
    allowedHosts: ['ims-zijf.onrender.com']
    },

})
