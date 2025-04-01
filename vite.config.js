import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/kit': {
        target: 'https://kit.fontawesome.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kit/, ''),
      },
    },
  },
})


