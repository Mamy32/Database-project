import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    preset: 'vercel',
    // If your backend relies on that specific src/server.ts file Lovable created:
    entry: 'server', 
  },
  vite: {
    plugins: [
      tsConfigPaths(),
      // TanStack usually handles React, but if you get React errors, uncomment the line below:
      // react() 
    ],
  },
})