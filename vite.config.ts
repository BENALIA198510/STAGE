// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/STAGE/', // 👈 هذا السطر مهم ليعمل الموقع على GitHub Pages
  plugins: [react()],
})

