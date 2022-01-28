import { UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
} from 'vite-plugin-style-import'

export default (): UserConfigExport => {
  return {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      jsx(),
      createStyleImportPlugin({
        resolves: [AndDesignVueResolve(), ElementPlusResolve(), VantResolve()],
      }),
    ],
  }
}
