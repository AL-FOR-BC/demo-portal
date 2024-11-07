import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rom/",
  plugins: [react()],
  define: {
    "import.meta.env.ENVIRONMENT": JSON.stringify("production"),
    "import.meta.env": JSON.stringify(process.env),
    "import.meta.env.VITE_EHUB_BACKEND_URL": JSON.stringify(
      // LOCAL
      // "http://localhost:5000",

      // PROD
      "http://51.8.80.47:5000"

    ),
    "import.meta.env.VITE_EHUB_BC_URL": JSON.stringify(
      // LOCAL
      // "https://api.businesscentral.dynamics.com/v2.0/df78e20f-3ca1-4018-9157-8bedb2673da2/Sandbox/"
      // PROD
      "https://api.businesscentral.dynamics.com/v2.0/24528e89-fa53-4fc5-9847-429bb50802ff/ROMSandbox/"
    ),
  },
  build: {
    minify: 'terser',
    terserOptions: {
      keep_fnames: true,
      keep_classnames: true,
      compress: {
        drop_console: false, // Keep console logs if needed
        pure_funcs: ['console.log'], // Or remove console.logs in production
        arguments: false  // Add this line
      },
      mangle: {
        keep_fnames: true,
        keep_classnames: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    keepNames: true
  }
});
