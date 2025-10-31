import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allows Vite to listen on any host
    port: 5173, // optional, your dev port
  },
  preview: {
    allowedHosts: ['localhost-old-osbs.onrender.com'], // add your Render host here
  },
});
