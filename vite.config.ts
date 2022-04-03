import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { presetAttributify, presetUno } from 'unocss'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import Icons from 'unplugin-icons/vite'


export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  switch (command) {
    case "serve":
      break;
    case "build":
      break;
    default:

  }
  return {
    build: {
      target: 'es2015', rollupOptions: {
        output: {
          manualChunks: {
            chartjs: ['chart.js']
          }
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({
            prefix: 'i'
          }),
        ]
      }),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      }),
      visualizer(),
      Unocss({
        presets: [
          presetAttributify({ /* preset options */ }),
          presetUno(),
        ]
      }),
      Icons({ /* options */ }),
    ],
    server: {
      port: 3001
    }
  };
});
