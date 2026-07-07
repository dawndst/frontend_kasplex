/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import compression from 'vite-plugin-compression'
import { resolve } from 'path'
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  server: {
    port: 8080,
    proxy: {
      // local faucet backend (faucet-server/)
      '/faucet-api': {
        target: 'http://localhost:8790',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/faucet-api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  }
})