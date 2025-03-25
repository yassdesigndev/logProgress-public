import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: env.VITE_PWA_NAME || 'logProgress - Track Finances, Health, and Daily Habits',
          short_name: env.VITE_PWA_SHORT_NAME || 'logProgress',
          description: 'Track your finances, health metrics, and daily habits',
          theme_color: env.VITE_PWA_THEME_COLOR || '#ffffff',
          background_color: env.VITE_PWA_BACKGROUND_COLOR || '#ffffff',
          display: 'standalone',
          start_url: '/',
          orientation: 'portrait',
          scope: '/',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api/],
          skipWaiting: true,
          clientsClaim: true
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    server: {
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          connect-src 'self' ${process.env.VITE_CSP_CONNECT_SRC || '*'};
          img-src 'self' data: https:;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          worker-src 'self' blob:;
        `.replace(/\s+/g, ' ').trim(),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    },
    build: {
      target: ['es2015', 'safari11'],
      minify: 'terser',
      terserOptions: {
        safari10: true,
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['chart.js', 'react-chartjs-2']
          }
        }
      }
    }
  };
});