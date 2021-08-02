import type { Plugin } from 'vite';
import type { ExternalOption } from 'rollup';
import type { ChangeCaseType, VitePluginOptions, LibraryNameChangeCase, Lib } from './types';
import { createFilter } from '@rollup/pluginutils';
import * as changeCase from 'change-case';
import { init, parse, ImportSpecifier } from 'es-module-lexer';
import MagicString from 'magic-string';
import path from 'path';
import fs from 'fs';
import { debug as Debug } from 'debug';
import { fileExists, isPnp, isRegExp, resolveNodeModules, resolvePnp } from './utils';

const debug = Debug('vite-plugin-style-import');

const ensureFileExts: string[] = ['.css', '.js', '.scss', '.less', '.styl'];

const asRE = /\s+as\s+\w+,?/g;
const isFn = (value: any): value is (...args: any[]) => any =>
  value != null && Object.prototype.toString.call(value) === '[object Function]';

export * from './types';

export default (options: VitePluginOptions): Plugin => {
  const {
    include = ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    exclude = 'node_modules/**',
    root = process.cwd(),
    libs = [],
  } = options;

  const filter = createFilter(include, exclude);

  let needSourcemap = false;
  let isBuild = false;
  let external: ExternalOption | undefined;

  debug('plugin options:', options);

  return {
    name: 'vite:style-import',
    enforce: 'post',
    configResolved(resolvedConfig) {
      needSourcemap = !!resolvedConfig.build.sourcemap;
      isBuild = resolvedConfig.isProduction || resolvedConfig.command === 'build';
      external = resolvedConfig?.build?.rollupOptions?.external ?? undefined;
      debug('plugin config:', resolvedConfig);
    },
    async transform(code, id) {
      if (!code || !filter(id) || !needTransform(code, libs)) {
        return null;
      }

      await init;

      let imports: readonly ImportSpecifier[] = [];
      try {
        imports = parse(code)[0];
        debug('imports:', imports);
      } catch (e) {
        debug('imports-error:', e);
      }
      if (!imports.length) {
        return null;
      }

      let s: MagicString | undefined;
      const str = () => s || (s = new MagicString(code));

      for (let index = 0; index < imports.length; index++) {
        const { n, se, ss } = imports[index];
        if (!n) continue;

        const lib = getLib(n, libs, external);
        if (!lib) continue;

        const isResolveComponent = isBuild && !!lib.resolveComponent;

        const importStr = code.slice(ss, se);
        let importVariables = transformImportVar(importStr);
        importVariables = filterImportVariables(importVariables, lib.importTest);
        const importCssStrList = transformComponentCss(root, lib, importVariables);

        let compStrList: string[] = [];
        let compNameList: string[] = [];

        if (isResolveComponent) {
          const { componentStrList, componentNameList } = transformComponent(lib, importVariables);
          compStrList = componentStrList;
          compNameList = componentNameList;
        }

        debug('prepend import css str:', importCssStrList.join(''));
        debug('prepend import component str:', compStrList.join(''));

        const { base = '' } = lib;

        let baseImporter = base ? '\n' + `import '${base}'` : '';

        if (str().toString().includes(base)) {
          baseImporter = '';
        }

        // TODO There may be boundary conditions. There is no semicolon ending in the code and the code is connected to one period. But such code should be very bad
        const endIndex = se + 1;
        // if (isBuild) {

        // } else {
        //   str().append(`\n${compStrList.join('')}${importCssStrList.join('')}`);
        // }

        if (isResolveComponent && compNameList.some((item) => importVariables.includes(item))) {
          // TODO  Special treatment element plus
          if (lib.libraryName === 'element-plus') {
            str().remove(ss, endIndex);
          } else {
            const importStr = str().slice(ss, endIndex);
            const [resultStr, uncssList] = await removeAlreadyName(root, importStr, lib);
            if (resultStr) {
              str().overwrite(ss, endIndex, resultStr);
            } else {
              str().remove(ss, endIndex);
            }

            if (uncssList.length) {
              compStrList = compStrList.filter(
                (item) => !uncssList.some((imp) => item.startsWith(`import ${imp}`))
              );
            }
          }
        }

        str().prependRight(
          endIndex,
          `${baseImporter}\n${compStrList.join('')}${importCssStrList.join('')}`
        );
      }
      return {
        map: needSourcemap ? str().generateMap({ hires: true }) : null,
        code: str().toString(),
      };
    },
  };
};

function filterImportVariables(importVars: readonly string[], reg?: RegExp) {
  if (!reg) {
    return importVars;
  }
  return importVars.filter((item) => reg.test(item));
}

async function removeAlreadyName(
  root: string,
  importStr: string,
  lib: Lib
): Promise<[string, string[]]> {
  let result = importStr;
  const { libraryNameChangeCase = 'paramCase', resolveStyle } = lib;
  const exportStr = importStr.replace(asRE, ',').replace('import', 'export').replace(asRE, ',');
  await init;
  const importComponents = parse(exportStr)[1];

  const hasCssList: string[] = [];
  const unCssList: string[] = [];
  importComponents.filter((comp) => {
    const name = getChangeCaseFileName(comp, libraryNameChangeCase);
    const importStr = resolveStyle?.(name);
    const cssFile = resolveNodeModules(root, importStr!);

    if (fs.existsSync(cssFile)) {
      hasCssList.push(comp);
    } else {
      unCssList.push(comp);
    }
  });

  hasCssList.forEach((item) => {
    result = result.replace(new RegExp(`\\s?${item}\\s?,?`), '');
  });

  if (parse(result.replace('import', 'export'))[1].length === 0) {
    result = '';
  }
  return [result, unCssList];
}

// Generate the corresponding component css string array
function transformComponentCss(root: string, lib: Lib, importVariables: readonly string[]) {
  const {
    libraryName,
    resolveStyle,
    esModule,
    libraryNameChangeCase = 'paramCase',
    ensureStyleFile = false,
  } = lib;
  if (!isFn(resolveStyle) || !libraryName) {
    return [];
  }
  const set = new Set<string>();
  for (let index = 0; index < importVariables.length; index++) {
    const name = getChangeCaseFileName(importVariables[index], libraryNameChangeCase);

    let importStr = resolveStyle(name);
    if (!importStr) {
      continue;
    }

    let isAdd = true;

    if (isPnp) {
      importStr = resolvePnp(importStr);
      isAdd = !!importStr;
    } else {
      if (esModule) {
        importStr = resolveNodeModules(root, importStr);
      }

      if (ensureStyleFile) {
        isAdd = ensureFileExists(root, importStr, esModule);
      }
    }
    isAdd && set.add(`import '${importStr}';\n`);
  }
  debug('import css sets:', set.toString());
  return Array.from(set);
}

// Generate the corresponding component  string array
function transformComponent(lib: Lib, importVariables: readonly string[]) {
  const {
    libraryName,
    resolveComponent,
    libraryNameChangeCase = 'paramCase',
    transformComponentImportName,
  } = lib;
  if (!isFn(resolveComponent) || !libraryName) {
    return {
      componentStrList: [],
      componentNameList: [],
    };
  }

  const componentNameSet = new Set<string>();
  const componentStrSet = new Set<string>();

  for (let index = 0; index < importVariables.length; index++) {
    const libName = importVariables[index];

    const name = getChangeCaseFileName(importVariables[index], libraryNameChangeCase);
    const importStr = resolveComponent(name);

    const importLibName =
      (isFn(transformComponentImportName) && transformComponentImportName(libName)) || libName;

    componentStrSet.add(`import ${importLibName} from '${importStr}';\n`);
    componentNameSet.add(libName);
  }
  debug('import component set:', componentStrSet.toString());
  return {
    componentStrList: Array.from(componentStrSet),
    componentNameList: Array.from(componentNameSet),
  };
}

// Extract import variables
export function transformImportVar(importStr: string) {
  if (!importStr) {
    return [];
  }

  const exportStr = importStr.replace('import', 'export').replace(asRE, ',');
  let importVariables: readonly string[] = [];
  try {
    importVariables = parse(exportStr)[1];
    debug('importVariables:', importVariables);
  } catch (error) {
    debug('transformImportVar:', error);
  }
  return importVariables;
}

// Make sure the file exists
// Prevent errors when importing non-existent css files
function ensureFileExists(root: string, importStr: string, esModule = false) {
  const extName = path.extname(importStr);
  if (!extName) {
    return tryEnsureFile(root, importStr, esModule);
  }

  if (esModule) {
    return fileExists(importStr);
  }

  return true;
}

function tryEnsureFile(root: string, filePath: string, esModule = false) {
  const filePathList = ensureFileExts.map((item) => {
    const p = `${filePath}${item}`;
    return esModule ? p : resolveNodeModules(root, p);
  });
  return filePathList.some((item) => fileExists(item));
}

function getLib(libraryName: string, libs: Lib[], external?: ExternalOption) {
  let libList = libs;
  if (external) {
    const isString = typeof external === 'string';
    const isRE = isRegExp(external);
    if (isString) {
      libList = libList.filter((item) => item.libraryName !== external);
    } else if (isRE) {
      libList = libList.filter((item) => !(external as RegExp).test(item.libraryName));
    } else if (Array.isArray(external)) {
      libList = libList.filter((item) => {
        return !external.some((val) => {
          if (typeof val === 'string') {
            return val === item.libraryName;
          }
          return (val as RegExp).test(item.libraryName);
        });
      });
    }
  }
  return libList.find((item) => item.libraryName === libraryName);
}

// File name conversion style
export function getChangeCaseFileName(
  importedName: string,
  libraryNameChangeCase: LibraryNameChangeCase
) {
  try {
    return changeCase[libraryNameChangeCase as ChangeCaseType](importedName);
  } catch (error) {
    return importedName;
  }
}

// Do you need to process code
function needTransform(code: string, libs: Lib[]) {
  return !libs.every(({ libraryName }) => {
    return !new RegExp(`('${libraryName}')|("${libraryName}")`).test(code);
  });
}
