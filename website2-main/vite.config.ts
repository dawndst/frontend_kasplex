/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import compression from 'vite-plugin-compression'
import { resolve } from 'path'
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  base: './',
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
      // kasplex explorer
      '/kasplex-api': {
        target: 'https://api-explorer.kasplex.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kasplex-api/, ''),
      },
      '/kasplex-krc20': {
        target: 'https://archive-api.kasplex.org/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/kasplex-krc20/, '/v1')
      },

      // sgx / proof
      '/sgx-api': {
        target: 'http://144.91.88.164:8090/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sgx-api/, ''),
      },
      '/stats-api': {
        target: 'https://stats-explorer.kasplex.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stats-api/, '/api/v1'),
        secure: true
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
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#043744 ',
          'link-color': '#25E2DD',
          'border-radius-base': '5px'
        },
        additionalData: `@import "@/styles/variables.less";`
      }
    },
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