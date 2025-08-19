import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: { host: true, port: 5173 },
  preview: { port: 5173 },
  build: {
    target: 'es2020',
    outDir: 'www',   // chỉ build ra www
    emptyOutDir: true // xoá sạch www trước khi build (tránh file thừa)
  }
})


