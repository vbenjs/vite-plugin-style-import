import type { Lib } from '../typing'

export function VantResolve(): Lib {
  return {
    libraryName: 'vant',
    esModule: true,
    resolveStyle: (name) => {
      return `vant/es/${name}/style`
    },
  }
}
