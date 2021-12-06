import { UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import styleImport, {
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  VxeTableResolve,
} from '../../dist/index'

export default (): UserConfigExport => {
  return {
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
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
        resolves: [AndDesignVueResolve(), VantResolve(), ElementPlusResolve(), VxeTableResolve()],
      }),
    ],
  }
}
