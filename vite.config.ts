import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { presetAttributify, presetUno } from 'unocss'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
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
