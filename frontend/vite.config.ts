import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"


export default defineConfig({
  plugins: [
   TanStackRouterVite(),
   tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),  
  react()],
  server: {
  allowedHosts: [
    "immunology-caution-within-len.trycloudflare.com",
  ],

  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
    },
  },
}
,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
