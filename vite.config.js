import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["ims-zijf.onrender.com"],
    host: true,
    strictPort: true,
    port: 8000,
    },

})
