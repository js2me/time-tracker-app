import viteLegacyPlugin from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import browserslist from 'browserslist';
import dotenv from 'dotenv';
import {defineConfig} from 'vite';
import {default as checker} from 'vite-plugin-checker';
import {default as eslint} from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import {createHtmlPlugin as html} from 'vite-plugin-html';
import {VitePWA} from 'vite-plugin-pwa'


import path from 'path';

import {checkFeatureSupport} from './build/utils/check-feature-support';
import {getBrowsers} from './build/utils/get-browsers';
import packageJson from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isPreview = process.env.MODE === 'preview'

dotenv.config({
  path: !isPreview && isProd ? './.env.production' : './.env'
});

const browserTargets = browserslist.loadConfig({
  path: path.resolve(__dirname),
});

const buildEnvs: BuildEnvVariables = {
  VERSION: packageJson.version,
  DEV: !isProd,
  MOCKS: process.env.MOCKS === 'true' || process.env.MOCKS === '1',
  LOGGER: process.env.LOGGER === 'true' || process.env.LOGGER === '1',
  BASE_URL: process.env.PUBLIC_URL || '/',
  PREVIEW: isPreview,
  POLYFILLS: {
    RESIZE_OBSERVER: !checkFeatureSupport('resizeobserver', browserTargets),
  },
};

console.info('BROWSERS SUPPORT: ');
console.info(
    getBrowsers(browserTargets)
        .browsers.map((browser) => {
      const versions = Object.keys(browser.versions)
          .map((v) => +v.split('-')[0])
          .filter(Boolean)
          .sort((a, b) => a - b);

      return `${browser.name}:${
          versions[0] ? ` ${versions[0]}+` : ''
      } (coverage: ${browser.coverage} %)`;
    })
        .join('\n'),
);

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'spa',
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  base: process.env.PUBLIC_URL || '/',
  clearScreen: true,
  define: Object.entries(buildEnvs).reduce((acc, entry) => {

    acc[`buildEnvs.${entry[0]}`] = JSON.stringify(entry[1])
    return acc
  }, {} as Record<string, any>),
  server: {
    port: +process.env.PORT || 8081,
    hmr: true,
  },
  preview: {
    port: +process.env.PORT || 8081,
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  css: {
    preprocessorOptions: {},
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: isProd
          ? '[hash:base64:4]'
          : '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    emptyOutDir: true,
    minify: process.env.NODE_ENV === "production",
    rollupOptions: {
      cache: !isProd,
      output: {
        entryFileNames: 'static/js/entry.[hash].js',
        assetFileNames: 'static/assets/[name].[hash].[ext]',
        chunkFileNames: 'static/js/[name].[hash].js',
        // assetFileNames: '[name].[hash].[ext]',
        // chunkFileNames: '[name].[hash].js',
        // manualChunks: {
        //   vendor: ['react', 'react-dom', 'effector', 'patronum', 'atomic-router'],
        //   app: [path.resolve(__dirname, './src/app')],
        //   entities: [
        //     // path.resolve(__dirname, './src/shared/_entities/app'),
        //     // path.resolve(__dirname, './src/shared/_entities/lang'),
        //     // path.resolve(__dirname, './src/shared/_entities/router'),
        //     path.resolve(__dirname, './src/entities')
        //   ],
        //   features: [path.resolve(__dirname, './src/features')],
        //   // 'shared-ui': [path.resolve(__dirname, './src/shared/ui')],
        //   'shared-api': [path.resolve(__dirname, './src/shared/api')],
        //   // 'shared-lib': [path.resolve(__dirname, './src/shared/lib')],
        //   // 'concierge-home': [path.resolve(__dirname, './src/pages/_old_concierge/home')],
        //   // 'app': [path.resolve(__dirname, './src/app')],
        // },

        // detailed output info
        // assetFileNames: (assetInfo) => {
        //   const parts = assetInfo.name.split('/');
        //   return 'assets/[name].[hash].[ext]';
        // },
        // chunkFileNames: (chunkInfo) => {
        //   const filePath = ['js'];
        //   let fileName = '[name].[hash].js';
        //
        //   if (
        //     chunkInfo.facadeModuleId &&
        //     (chunkInfo.facadeModuleId.endsWith('index.ts') ||
        //       chunkInfo.facadeModuleId.endsWith('index.tsx'))
        //   ) {
        //     const parts = chunkInfo.facadeModuleId.split('/');
        //     const fsLayer = layersLib.FS_LAYERS.find((fsLayer) =>
        //       chunkInfo.facadeModuleId.includes(`src/${fsLayer}`),
        //     );
        //
        //     if (fsLayer) {
        //       filePath.push(fsLayer);
        //     } else {
        //       filePath.push('other');
        //     }
        //
        //     fileName = [parts[parts.length - 2] || '[name]', '[hash]', 'js']
        //       .filter(Boolean)
        //       .join('.');
        //   } else {
        //     filePath.push('other');
        //   }
        //
        //   return `${filePath.join('/')}/${fileName}`;
        // },
      },
    },
  },
  plugins: [
    viteLegacyPlugin({
      targets: browserTargets,
      modernPolyfills: [
        'es/object/from-entries',
        !checkFeatureSupport('array-flat', browserTargets) && 'es/array/flat',
      ].filter(Boolean),
      polyfills: [
        'es/object/from-entries',
        !checkFeatureSupport('array-flat', browserTargets) && 'es/array/flat',
      ].filter(Boolean),
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    svgr({
      // svgrOptions: {
      //   // TODO: решить проблему сохранения class атритбута у свг элементов
      //   svgo: false,
      //   // svgProps:
      // }
    }),
    isProd && VitePWA({
      manifest: {
        "background_color": "#ffffff",
        "theme_color": "#f3f3f3",
        "description": "Трекаем время, работаем над фрилансом, зарабатываем деньги",
        "display": "fullscreen",
        "icons": [
          {
            "src": "favicon.png",
            "sizes": "76x66",
            "type": "image/png"
          },
          {
            "src": "logo.png",
            "sizes": "513x505",
            "type": "image/png"
          }
        ],
        "name": "Фриланс Тайм Машина",
        "short_name": "Фриланс Тайм Машина",
        "start_url": "/"
      }
    }),
    isProd && eslint(),
    react({
      plugins: []
    }),
    isProd && checker({
      typescript: true,
    }),
    html({
      minify: isProd,
      inject: {
        data: {
          baseUrl: buildEnvs.BASE_URL || '/',
        }
      }
    }),
  ].filter(Boolean),
});

