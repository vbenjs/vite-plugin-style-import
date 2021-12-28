# vite-plugin-style-import

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

A plug-in that imports component library styles on demand

## Why only import styles

Because vite itself has imported the component library on demand, only the style is not on demand, so just import the style on demand.

## Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-style-import -D
```

or

```
npm i vite-plugin-style-import -D
```

## Effect

```ts

import { Button } from 'ant-design-vue';

        ↓ ↓ ↓ ↓ ↓ ↓

import { Button } from 'ant-design-vue';
import 'ant-design-vue/es/button/style/index.js';

```

```ts

import { ElButton } from 'element-plus';

        ↓ ↓ ↓ ↓ ↓ ↓

// dev
import { Button } from 'element-plus';
import 'element-plus/lib/theme-chalk/el-button.css`;

// prod
import Button from 'element-plus/lib/el-button';
import 'element-plus/lib/theme-chalk/el-button.css';

```

## Usage

- Config plugin in vite.config.ts

```ts
import { UserConfigExport } from 'vite'
import styleImport, {
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve,
} from 'vite-plugin-style-import'

export default (): UserConfigExport => {
  return {
    // 1. If you are using the ant-design series, you need to configure this
    // 2. Make sure less is installed in the dependency `yarn add less -D`
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      styleImport({
        resolves:[
          AndDesignVueResolve(),
          VantResolve(),
          ElementPlusResolve(),
          NutuiResolve(),
          AntdResolve(),],
        libs: [
          // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`
            },
          },
        ],
      }),
    ],
  }
}
```

### Options

| param    | type                                                  | default                                          | description                                               |
| -------- | ----------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| include  | `string、RegExp、(string、RegExp)[]、null、undefined` | `['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx']` | Code directory and file format to be converted            |
| exclude  | `string、RegExp、(string、RegExp)[]、null、undefined` | `'node_modules/**'`                              | Excluded files/folders                                    |
| libs     | `Lib[]`                                               |                                                  | List of libraries to be imported                          |
| resolves | `Lib[]`                                               |                                                  | List of libraries to be imported (built-in by the plugin) |

**Lib**

```ts
{
  // Import names that meet this rule will take effect. The default is null, which can be applied to resolveComponent and resolveStyle at the same time
  importTest?: Regexp;

  // Need to imported  library name
  libraryName: string;

  // Custom style file conversion
  resolveStyle: (name: string) => string;

  // Name conversion for library export
  // default: paramCase
  libraryNameChangeCase?: LibraryNameChangeCase;

  // If the style file is not .css suffix. Need to turn on this option
  // default: false
  esModule?: boolean;

  /**
   * There may be some component libraries that are not very standardized.
   * You can turn on this to ignore to determine whether the file exists. Prevent errors when importing non-existent css files.
   * Performance may be slightly reduced after it is turned on, but the impact is not significant
   * default: false
   */
  ensureStyleFile?: boolean;

  // https://github.com/anncwb/vite-plugin-style-import/pull/5
  // Used in some situations where components may need to be introduced on demand, not just to introduce styles.(Libraries that don't support Esm well)
  // Only work in production
  resolveComponent?: (name: string) => string;

  // https://github.com/anncwb/vite-plugin-style-import/issues/12
  // `import ${libName} from 'xxxx';`
  // Used for custom import name
  // Only work in production
  transformComponentImportName?: (name: string) => string;
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

## Example

**Run Example**

```bash

cd ./example

yarn install

yarn serve

```

## Sample project

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

MIT

[npm-img]: https://img.shields.io/npm/v/vite-plugin-style-import.svg
[npm-url]: https://npmjs.com/package/vite-plugin-style-import
[node-img]: https://img.shields.io/node/v/vite-plugin-style-import.svg
[node-url]: https://nodejs.org/en/about/releases/
