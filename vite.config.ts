import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { execSync } from "child_process";
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }: ConfigEnv) => ({
  // Set base to "/" (or your subfolder path) so that assets load correctly in production.
  base: "/",
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["be7539a5-f5f0-48ec-8f02-bd31e0e258c1.lovableproject.com"],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'images/*.svg', 'images/*.jpg', 'images/*.png'],
      manifest: {
        name: 'DockDive',
        short_name: 'DockDive',
        description: 'Boat sales and advertisement platform',
        theme_color: '#396796',
        icons: [
          { src: '/favicon.ico', sizes: '64x64', type: 'image/x-icon' },
          { src: '/images/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 2000000,
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    }),
    createHtmlPlugin({
      inject: {
        tags: [
          { injectTo: 'head-prepend', tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
          { injectTo: 'head-prepend', tag: 'link', attrs: { rel: 'preload', as: 'image', href: '/images/lcp-image.webp' } }
        ]
      }
    }),
    compression(),
    {
      name: 'generate-sitemap',
      closeBundle: async () => {
        if (mode === 'production') {
          try {
            console.log('Generating sitemap.xml...');
            // execSync('node ./scripts/generateSitemap.cjs', { stdio: 'inherit' });
          } catch (error) {
            console.error('Error generating sitemap:', error);
          }
        }
      },
    },
    {
      name: 'generate-pwa-icons',
      buildStart: async () => {
        const pwaIconDirs = ['public/images'];
        const pwaIcons = ['pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png'];
        pwaIconDirs.forEach(dir => {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
        pwaIcons.forEach(icon => {
          const iconPath = `public/images/${icon}`;
          if (!fs.existsSync(iconPath) && fs.existsSync('public/favicon.ico')) {
            try {
              fs.copyFileSync('public/favicon.ico', iconPath);
              console.log(`Created placeholder PWA icon: ${iconPath}`);
            } catch (error) {
              console.warn(`Could not create PWA icon ${iconPath}:`, error);
            }
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    cssMinify: mode === 'production',
    reportCompressedSize: true,
    sourcemap: mode === 'production',
    chunkSizeWarningLimit: 1000,
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
        entryFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
      },
      treeshake: mode === 'production',
    },
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  logLevel: mode === 'development' ? 'info' : 'warn',
  css: { devSourcemap: true, preprocessorOptions: {} },
  cacheControl: { public: true, maxAge: 31536000, immutable: true },
}));
