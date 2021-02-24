export type RegOptions = string | RegExp | (string | RegExp)[] | null | undefined;

export interface Lib {
  /**
   * Dependent library name
   */
  libraryName: string;
  /**
   * When the imported style file does not end with .css, it needs to be turned on
   * @default: false
   */
  esModule?: boolean;
  /**
   * Custom imported component style conversion
   */
  resolveStyle: (name: string) => string;
  /**
   * Custom component file conversion
   * Turning on the environment does not work
   */
  resolveComponent?: (name: string) => string;
  /**
   * Customize imported component file name style conversion
   * @default: paramCase
   */
  libraryNameChangeCase?: LibraryNameChangeCase;
}

export interface VitePluginComponentImport {
  include?: RegOptions;
  exclude?: RegOptions;
  libs: Lib[];
}

export interface Source {
  opts: { libs: Lib[]; cacheDir: string };
}

export type LibraryNameChangeCase = ChangeCaseType | ((name: string) => string);

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
  | 'snakeCase';
