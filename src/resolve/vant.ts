import type { Lib } from '../types'

export function VantResolve(): Lib {
  return {
    libraryName: 'vant',
    esModule: true,
    resolveStyle: (name) => {
      return `vant/es/${name}/style`
    },
  }
}
