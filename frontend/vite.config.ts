import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three'
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) return 'vendor-charts'
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom'
          if (id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
        },
      },
    },
  },
})
