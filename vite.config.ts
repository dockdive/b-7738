
import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { execSync } from "child_process";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'production',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
        warn(warning);
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
          if (id.includes('@radix-ui/react-')) return 'ui';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) return 'forms';
          if (id.includes('/locales/')) return 'locales';
          if (id.includes('lodash')) return 'lodash';
          return null;
        },
      },
      treeshake: mode === 'production',
    },
  },
  css: { devSourcemap: true },
}));
