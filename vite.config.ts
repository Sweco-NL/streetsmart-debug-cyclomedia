import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "csp-headers",
      configurePreviewServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader(
            "Content-Security-Policy",
            // To reproduce the unsafe-eval issue: use the CSP below (without 'wasm-unsafe-eval') and run `npm start`.
            // To suppress the error: swap in the line that includes 'wasm-unsafe-eval'.
            // Note: 'wasm-unsafe-eval' or 'unsafe-eval' is not acceptable in our production CSP.
            //
            // This triggers the error:
            "script-src 'self' https://streetsmart.cyclomedia.com blob:; worker-src 'self' blob:; connect-src 'self' https://*.cyclomedia.com https://*.amplitude.com",
            //
            // This does not trigger the error:
            // "script-src 'self' 'wasm-unsafe-eval' https://streetsmart.cyclomedia.com blob:; worker-src 'self' blob:; connect-src 'self' https://*.cyclomedia.com https://*.amplitude.com",
          );
          next();
        });
      },
    },
  ],
});
