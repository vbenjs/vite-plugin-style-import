import type { Lib } from '../typing'

export function NutuiResolve(): Lib {
  return {
    libraryName: '@nutui/nutui',
    libraryNameChangeCase: 'pascalCase',
    resolveStyle: (name) => {
      return `@nutui/nutui/dist/packages/${name.toLowerCase()}/index.scss`
    },
  }
}
