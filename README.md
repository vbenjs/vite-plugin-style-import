# vite-plugin-style-import

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

A plug-in that imports component library styles on demand

## Why only import styles

Because vite itself has imported the component library on demand, only the style is not on demand, so just import the style on demand.

## Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0-beta.30

`yarn add vite-plugin-style-import -D` or `npm i vite-plugin-style-import -D`

## Effect

```ts

import { Button } from 'ant-design-vue';

        ↓ ↓ ↓ ↓ ↓ ↓

import { Button } from 'ant-design-vue';
import 'ant-design-vue/es/button/style/css.js';

```

```ts

import { ElButton } from 'element-plus';

        ↓ ↓ ↓ ↓ ↓ ↓

import { Button } from 'element-plus';
import 'element-plus/lib/theme-chalk/el-button.css`;

```

## Usage

- Config plugin in vite.config.ts

```ts
import { UserConfigExport } from 'vite';
import styleImport from '../src';

export default (): UserConfigExport => {
  return {
    plugins: [
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/css`;
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

### Options

| param | type | default | description |
| --- | --- | --- | --- |
| include | `string / RegExp / (string / RegExp)[] / null / undefined` | `['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx']` | Code directory and file format to be converted |
| exclude | `string / RegExp / (string / RegExp)[] / null / undefined` | `'node_modules/**'` | Excluded files/folders |
| libs | `Lib[]` |  | List of libraries to be imported |

**Lib**

```ts
{
  // Need to imported  library name
  libraryName: string;
  // Custom style file conversion
  resolveStyle: (name: string) => string;

  // Name conversion for library export
  // default: paramCase
  libraryNameChangeCase?: LibraryNameChangeCase;

  // If the style file is not .css suffix. Need to turn on this option
  esModule?: boolean;

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

## License

MIT

[npm-img]: https://img.shields.io/npm/v/vite-plugin-style-import.svg
[npm-url]: https://npmjs.com/package/vite-plugin-style-import
[node-img]: https://img.shields.io/node/v/vite-plugin-style-import.svg
[node-url]: https://nodejs.org/en/about/releases/
