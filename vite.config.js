import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = process.cwd().replace(/\\/g, '/').replace(/^([A-Z]):/, (_, drive) => `${drive.toLowerCase()}:`)

export default defineConfig({
  root,
  plugins: [react()],
})
