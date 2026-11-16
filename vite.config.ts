import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Para GitHub Pages en un repo (usuario.github.io/Viewly/) define BASE_PATH=/Viewly/ al compilar.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
