import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Allow access via LAN IP and temporary demo tunnels
  // (Cloudflare quick tunnel / localtunnel). Safe to keep; only affects
  // the dev/preview server, never the production bundle.
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
})
