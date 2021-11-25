import type { Lib } from '../types'

export function NutuiResolve(): Lib {
  return {
    libraryName: '@nutui/nutui',
    libraryNameChangeCase: 'pascalCase',
    resolveStyle: (name) => {
      return `@nutui/nutui/dist/packages/${name}/index.scss`
    },
  }
}
