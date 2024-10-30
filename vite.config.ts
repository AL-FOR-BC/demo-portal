import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rom/",
  plugins: [react()],
  define: {
    "import.meta.env": JSON.stringify(process.env),
    "import.meta.env.VITE_EHUB_BACKEND_URL": JSON.stringify(
      // LOCAL
      // "http://localhost:5000",

      // PROD
      "http://51.8.80.47:5000"

    ),
    "import.meta.env.VITE_EHUB_BC_URL": JSON.stringify(
      "https://api.businesscentral.dynamics.com/v2.0/df78e20f-3ca1-4018-9157-8bedb2673da2/Sandbox/"
    ),
  },
  build: {
    minify: 'terser',
    terserOptions: {
      keep_fnames: true,
      keep_classnames: true
    }
  }
});
