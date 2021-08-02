import { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import styleImport from '../../dist/index';

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
        libs: [
          {
            ensureStyleFile: true,
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`;
            },
          },
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: (name) => {
              return `vant/es/${name}/style`;
            },
          },
          {
            libraryName: 'element-plus',
            ensureStyleFile: true,
            esModule: true,
            resolveStyle: (name) => {
              return `element-plus/lib/theme-chalk/${name}.css`;
            },
            resolveComponent: (name) => {
              return `element-plus/lib/${name}`;
            },
            base: 'element-plus/lib/theme-chalk/base.css',
          },
        ],
      }),
    ],
  };
};
