export type RegOptions = string | RegExp | (string | RegExp)[] | null | undefined;

export interface Lib {
  libraryName: string;
  esModule?: boolean;
  resolveStyle: (name: string) => string;
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
