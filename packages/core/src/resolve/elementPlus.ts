import type { Lib } from '../types'

export function ElementPlusResolve(): Lib {
  return {
    libraryName: 'element-plus',
    ensureStyleFile: true,
    esModule: true,
    resolveStyle: (name) => {
      return `element-plus/theme-chalk/${name}.css`
    },
    resolveComponent: (name) => {
      return `element-plus/es/components/${name.replace(/^el-/, '')}/index.mjs`
    },
    base: 'element-plus/theme-chalk/base.css',
  }
}
