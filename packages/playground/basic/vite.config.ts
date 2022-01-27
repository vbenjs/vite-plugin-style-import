import { UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import styleImport, {
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
} from '../../dist/index'

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
      styleImport({
        resolves: [AndDesignVueResolve(), VantResolve(), ElementPlusResolve()],
      }),
    ],
  }
}
