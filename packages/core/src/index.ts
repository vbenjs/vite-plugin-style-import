import type { Plugin } from 'vite'
import type { ExternalOption } from 'rollup'
import type { ImportSpecifier } from 'es-module-lexer'
import type {
  ChangeCaseType,
  VitePluginOptions,
  LibraryNameChangeCase,
  Lib,
} from './typing'
import { createFilter } from '@rollup/pluginutils'
import * as changeCase from 'change-case'
import { init, parse } from 'es-module-lexer'
import MagicString from 'magic-string'
import path from 'pathe'
import consola from 'consola'
import {
  fileExists,
  isFunction,
  isPnp,
  isRegExp,
  resolveNodeModules,
  resolvePnp,
} from './utils'

const ensureFileExts: string[] = ['.css', '.js', '.scss', '.less', '.styl']
const asRE = /\s+as\s+\w+,?/g

consola.wrapConsole()

export function createStyleImportPlugin(options: VitePluginOptions): Plugin {
  const {
    include = ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    exclude = '**/node_modules/**',
    resolves = [],
  } = options

  let { libs = [] } = options
  libs = [...libs, ...resolves]

  const filter = createFilter(include, exclude)

  let needSourcemap = false
  let external: ExternalOption | undefined

  return {
    name: 'vite:style-import',
    enforce: 'post',
    configResolved(resolvedConfig) {
      needSourcemap = !!resolvedConfig.build.sourcemap
      external = resolvedConfig?.build?.rollupOptions?.external ?? undefined
    },
    async transform(code, id) {
      if (!code || !filter(id) || !needTransform(code, libs)) {
        return null
      }

      await init

      let imports: readonly ImportSpecifier[] = []
      try {
        imports = parse(code)[0]
      } catch (e) {
        consola.error(e)
      }
      if (!imports.length) {
        return null
      }

      let s: MagicString | undefined
      const str = () => s || (s = new MagicString(code))

      for (let index = 0; index < imports.length; index++) {
        const { n, se, ss } = imports[index]
        if (!n) continue

        const lib = getLib(n, libs, external)
        if (!lib) continue

        const importStr = code.slice(ss, se)

        let importVariables = transformImportVar(importStr)

        importVariables = filterImportVariables(importVariables, lib.importTest)

        const importCssStrList = await transformComponentCss(
          lib,
          importVariables,
        )

        const compStrList: string[] = []

        const { base = '' } = lib

        let baseImporter = base ? '\n' + `import '${base}'` : ''

        if (str().toString().includes(base)) {
          baseImporter = ''
        }

        // TODO There may be boundary conditions. There is no semicolon ending in the code and the code is connected to one period. But such code should be very bad
        const endIndex = se + 1

        str().prependRight(
          endIndex,
          `${baseImporter}\n${compStrList.join('')}${importCssStrList.join(
            '',
          )}`,
        )
      }
      return {
        map: needSourcemap ? str().generateMap({ hires: true }) : null,
        code: str().toString(),
      }
    },
  }
}

function filterImportVariables(importVars: readonly string[], reg?: RegExp) {
  if (!reg) {
    return importVars
  }
  return importVars.filter((item) => reg.test(item))
}

// Generate the corresponding component css string array
async function transformComponentCss(
  lib: Lib,
  importVariables: readonly string[],
) {
  const {
    libraryName,
    resolveStyle,
    esModule,
    libraryNameChangeCase = 'paramCase',
    ensureStyleFile = false,
  } = lib

  if (!isFunction(resolveStyle) || !libraryName) {
    return []
  }
  const set = new Set<string>()
  for (let index = 0; index < importVariables.length; index++) {
    const name = getChangeCaseFileName(
      importVariables[index],
      libraryNameChangeCase,
    )

    let importStr = resolveStyle(name)

    if (!importStr) {
      continue
    }

    let isAdd = true

    if (isPnp) {
      importStr = resolvePnp(importStr)
      isAdd = !!importStr
    } else {
      if (esModule) {
        importStr = resolveNodeModules(libraryName, importStr)
      }

      if (ensureStyleFile) {
        isAdd = ensureFileExists(libraryName, importStr, esModule)
      }
    }

    isAdd && set.add(`import '${importStr}';\n`)
  }

  return Array.from(set)
}

// Extract import variables
export function transformImportVar(importStr: string) {
  if (!importStr) {
    return []
  }

  const exportStr = importStr.replace('import', 'export').replace(asRE, ',')
  let importVariables: readonly string[] = []
  try {
    importVariables = parse(exportStr)[1]
  } catch (error) {
    consola.error(error)
  }
  return importVariables
}

// Make sure the file exists
// Prevent errors when importing non-existent css files
function ensureFileExists(
  libraryName: string,
  importStr: string,
  esModule = false,
) {
  const extName = path.extname(importStr)
  if (!extName) {
    return tryEnsureFile(libraryName, importStr, esModule)
  }

  if (esModule) {
    return fileExists(importStr)
  }

  return true
}

function tryEnsureFile(
  libraryName: string,
  filePath: string,
  esModule = false,
) {
  const filePathList = ensureFileExts.map((item) => {
    const p = `${filePath}${item}`

    return esModule ? p : resolveNodeModules(libraryName, p)
  })
  return filePathList.some((item) => fileExists(item))
}

function getLib(libraryName: string, libs: Lib[], external?: ExternalOption) {
  let libList = libs
  if (external) {
    const isString = typeof external === 'string'
    const isRE = isRegExp(external)
    if (isString) {
      libList = libList.filter((item) => item.libraryName !== external)
    } else if (isRE) {
      libList = libList.filter(
        (item) => !(external as RegExp).test(item.libraryName),
      )
    } else if (Array.isArray(external)) {
      libList = libList.filter((item) => {
        return !external.some((val) => {
          if (typeof val === 'string') {
            return val === item.libraryName
          }
          return (val as RegExp).test(item.libraryName)
        })
      })
    }
  }

  return libList.find((item) => item.libraryName === libraryName)
}

// File name conversion style
export function getChangeCaseFileName(
  importedName: string,
  libraryNameChangeCase: LibraryNameChangeCase,
) {
  try {
    return changeCase[libraryNameChangeCase as ChangeCaseType](importedName)
  } catch (error) {
    return importedName
  }
}

// Do you need to process code
function needTransform(code: string, libs: Lib[]) {
  return !libs.every(({ libraryName }) => {
    return !new RegExp(`('${libraryName}')|("${libraryName}")`).test(code)
  })
}

export * from './typing'
export * from './resolve'
