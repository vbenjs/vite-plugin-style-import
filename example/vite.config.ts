import { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import styleImport from '../src';

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
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`;
            },
          },
          {
            libraryName: 'element-plus',
            resolveStyle: (name) => {
              return `element-plus/lib/theme-chalk/${name}.css`;
            },
            // resolveComponent: (name) => {
            //   return `element-plus/lib/${name}`;
            // },
          },
        ],
      }),
    ],
  };
};
