export type RegOptions =
  | string
  | RegExp
  | (string | RegExp)[]
  | null
  | undefined

export interface Lib {
  importTest?: RegExp
  /**
   * Dependent library name
   */
  libraryName: string
  /**
   * When the imported style file does not end with .css, it needs to be turned on
   * @default: false
   */
  esModule?: boolean
  /**
   * Custom imported component style conversion
   */
  resolveStyle?: (name: string) => string

  /**
   * There may be some component libraries that are not very standardized.
   * You can turn on this to ignore to determine whether the file exists. Prevent errors when importing non-existent css files.
   * Performance may be slightly reduced after it is turned on, but the impact is not significant
   * @default: false
   */
  ensureStyleFile?: boolean

  /**
   * Customize imported component file name style conversion
   * @default: paramCase
   */
  libraryNameChangeCase?: LibraryNameChangeCase

  /**
   * Whether to introduce base style
   */
  base?: string
}

export interface VitePluginOptions {
  include?: RegOptions
  exclude?: RegOptions
  /**
   * @default process.cwd()
   * @deprecated 1.2.0 is obsolete
   */
  root?: string
  libs?: Lib[]
  resolves?: Lib[]
}

export interface Source {
  opts: { libs: Lib[]; cacheDir: string }
}

export type LibraryNameChangeCase = ChangeCaseType | ((name: string) => string)

export type ChangeCaseType =
  | 'camelCase'
  | 'capitalCase'
  | 'constantCase'
  | 'dotCase'
  | 'headerCase'
  | 'noCase'
  | 'paramCase'
  | 'pascalCase'
  | 'pathCase'
  | 'sentenceCase'
  | 'snakeCase'
