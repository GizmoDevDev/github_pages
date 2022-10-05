import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/github_pages/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})
