import type { Lib } from '../typing'

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
