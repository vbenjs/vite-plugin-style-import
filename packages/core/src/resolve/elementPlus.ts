import type { Lib } from '../typing'

export function ElementPlusResolve(): Lib {
  return {
    libraryName: 'element-plus',
    ensureStyleFile: true,
    esModule: true,
    resolveStyle: (name) => {
      return `element-plus/theme-chalk/${name}.css`
    },
    base: 'element-plus/theme-chalk/base.css',
  }
}
