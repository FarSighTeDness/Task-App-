import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT || env.CLIENT_PORT || 500),
      allowedHosts: true,
      proxy: {
        '/tasks': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:300',
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), VitePWA({
      registerType: 'prompt',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'react',
        short_name: 'react',
        description: 'react',
        theme_color: '#ffffff',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })],
  };
})