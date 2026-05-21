import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Allow access via LAN IP and temporary demo tunnels
  // (Cloudflare quick tunnel / localtunnel). Safe to keep; only affects
  // the dev/preview server, never the production bundle.
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        // Pin React + router into their own chunk. They almost never change
        // between deploys, so the browser keeps them cached across releases
        // and only re-downloads the small app chunk.
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
