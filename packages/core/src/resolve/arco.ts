import type { Lib } from '../typing'

export function ArcoResolver(): Lib {
  return {
    libraryName: '@arco-design/web-vue',
    esModule: true,
    resolveStyle: (name) => {
      return `@arco-design/web-vue/es/${name}/style/css.js`
    },
  }
}
