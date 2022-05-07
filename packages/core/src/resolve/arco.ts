import type { Lib } from '../typing'

export function ArcoResolve(type = 'css'): Lib {
  return {
    libraryName: '@arco-design/web-vue',
    esModule: true,
    ensureStyleFile: true,
    resolveStyle: (name) => {
      if (type === 'css') {
        return `@arco-design/web-vue/es/${name}/style/css.js`
      }
      return `@arco-design/web-vue/es/${name}/style/index.js`
    },
  }
}
