import type { Lib } from '../types'

export function AntdResolve(): Lib {
  return {
    libraryName: 'antd',
    esModule: true,
    resolveStyle: (name) => {
      return `antd/es/${name}/style/index`
    },
  }
}
