import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your GitHub repo name, e.g. '/langloop/'
// If deploying to a custom domain or username.github.io root repo, use '/'
export default defineConfig({
  plugins: [react()],
  base: '/langloop-wip/',
})
