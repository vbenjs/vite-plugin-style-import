import type { Lib } from '../types'

export function VxeTableResolve(): Lib {
  return {
    ensureStyleFile: true,
    libraryName: 'vxe-table',
    esModule: true,
    resolveStyle: (name) => {
      return `vxe-table/es/${name}/style.css`
    },
  }
}
