/* eslint-disable import/default */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import viteLegacyPlugin from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import browserslist from 'browserslist';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { default as checker } from 'vite-plugin-checker';
import { default as eslint } from 'vite-plugin-eslint';
import { createHtmlPlugin as html } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

import packageJson from './package.json';
// @ts-ignore ts(6307) ignore

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const isPreview = process.env.MODE === 'preview';

dotenv.config({
  path: !isPreview && isProd ? '.env.production' : '.env'
});

const browserTargets = browserslist.loadConfig({ path: '.' });

const baseUrl = process.env.PUBLIC_URL || '/';
const port = +process.env.PORT || 8081;

const useProxyTargetApiUrl = isPreview || isDev;

const buildEnvs = {
  VERSION: packageJson.version,
  DEV: !isProd,
  BASE_URL: baseUrl,
  PREVIEW: isPreview,
} satisfies BuildEnvariables

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'spa',
  mode: isProd ? 'production' : 'development',
  base: baseUrl,
  clearScreen: true,
  define: {
    buildEnvs: JSON.stringify(
      Object.assign(buildEnvs),
    ),
  },
  server: {
    port,
    hmr: true,
    cors: false,
  },
  preview: {
    port,
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  logLevel: 'info',
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: 'modern-compiler',
      },
    },
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: isProd
        ? '[hash:base64:4]'
        : '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    cssCodeSplit: true,
    reportCompressedSize: true,
    emptyOutDir: true,
    minify: isProd,
    cssMinify: isProd,
    cssTarget: false,
    ssrEmitAssets: false,
    ssrManifest: false,
    ssr: false,
    rollupOptions: {
      maxParallelFileOps: 100,
      cache: true,
      output: {
        entryFileNames: 'static/js/bundle.[hash].js',
        assetFileNames: 'static/assets/[name].[hash].[ext]',
        chunkFileNames: 'static/js/[name].[hash].js',
      },
    },
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@babel/plugin-proposal-decorators',
            {
              version: '2023-05',
            },
          ],
        ],
      },
    }),
    viteLegacyPlugin({
      targets: browserTargets,
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    svgr({}),
    isProd && VitePWA({
      manifest: {
        "background_color": "#ffffff",
        "theme_color": "#f3f3f3",
        "description": "Трекаем время, работаем над фрилансом, зарабатываем деньги",
        "display": "fullscreen",
        "icons": [
          {
            "src": "favicon.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "logo.png",
            "sizes": "391x391",
            "type": "image/png"
          },
          {
            "src": "logo-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        "name": "Фриланс Тайм Машина",
        "short_name": "Фриланс Тайм Машина",
        "start_url": "/"
      }
    }),
    isProd && eslint(),
    isProd &&
      checker({
        typescript: true,
      }),
    html({
      minify: isProd,
      inject: {
        data: {
          buildEnvs
        }
      }
    }),
  ].filter(Boolean),
});
