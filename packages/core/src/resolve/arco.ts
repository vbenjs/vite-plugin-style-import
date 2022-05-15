import type { Lib } from '../typing'

export function ArcoDesignResolve(): Lib {
  return {
    ensureStyleFile: true,
    libraryName: '@arco-design/web-vue',
    esModule: true,
    resolveStyle: (name) => {
      return `@arco-design/web-vue/es/${name}/style/index`
    },
  }
}
