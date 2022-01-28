import type { Lib } from '../typing'

export function AntdResolve(): Lib {
  return {
    libraryName: 'antd',
    esModule: true,
    resolveStyle: (name) => {
      return `antd/es/${name}/style/index`
    },
  }
}
