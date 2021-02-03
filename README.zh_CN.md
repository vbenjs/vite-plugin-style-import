# vite-plugin-style-import

**中文** | [English](./README.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

该插件可按需导入组件库样式

## 为什么只按需引入样式

由于 `vite` 本身已按需导入了组件库，因此仅样式不是按需导入的，因此只需按需导入样式即可。

## 安装 (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0-beta.64

```
yarn add vite-plugin-style-import -D
```

or

```
npm i vite-plugin-style-import -D
```

## 效果

```ts

import { Button } from 'ant-design-vue';

        ↓ ↓ ↓ ↓ ↓ ↓

import { Button } from 'ant-design-vue';
import 'ant-design-vue/lib/button/style/index.js';

```

```ts

import { ElButton } from 'element-plus';

        ↓ ↓ ↓ ↓ ↓ ↓

import { Button } from 'element-plus';
import 'element-plus/lib/theme-chalk/el-button.css`;

```

## 使用

- vite.config.ts 中的配置插件

```ts
import { UserConfigExport } from 'vite';
import styleImport from 'vite-plugin-style-import';

export default (): UserConfigExport => {
  return {
    // 1. 如果使用的是ant-design 系列的 需要配置这个
    // 2. 确保less安装在依赖 `yarn add less -D`
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
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
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => {
              return `antd/es/${name}/style/index`;
            },
          },
          {
            libraryName: 'element-plus',
            resolveStyle: (name) => {
              return `element-plus/lib/theme-chalk/${name}.css`;
            },
          },
        ],
      }),
    ],
  };
};
```

### 配置说明

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| include | `string / RegExp / (string / RegExp)[] / null / undefined` | `['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx']` | 包含的文件格式 |
| exclude | `string / RegExp / (string / RegExp)[] / null / undefined` | `'node_modules/**'` | 排除的的文件/文件夹 |
| libs | `Lib[]` |  | 要导入的库列表 |

**Lib**

```ts
{
  // 需要导入的库名
  libraryName: string;
  // 自定义样式转换
  resolveStyle: (name: string) => string ｜ string[];

  // 导出的名称转换格式
  // default: paramCase
  libraryNameChangeCase?: LibraryNameChangeCase;


  // 如果样式文件不是.css后缀。需要开启此选项
  esModule?: boolean
}

// LibraryNameChangeCase

export type LibraryNameChangeCase = ChangeCaseType | ((name: string) => string);

export type ChangeCaseType =
  | 'camelCase'
  | 'capitalCase'
  | 'constantCase'
  | 'dotCase'
  | 'headerCase'
  | 'noCase'
  | 'paramCase'
  | 'pascalCase'
  | 'pathCase'
  | 'sentenceCase'
  | 'snakeCase';


```

## 示例

**运行示例**

```bash

cd ./example

yarn install

yarn serve

```

## 示例项目

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

MIT

[npm-img]: https://img.shields.io/npm/v/vite-plugin-style-import.svg
[npm-url]: https://npmjs.com/package/vite-plugin-style-import
[node-img]: https://img.shields.io/node/v/vite-plugin-style-import.svg
[node-url]: https://nodejs.org/en/about/releases/
