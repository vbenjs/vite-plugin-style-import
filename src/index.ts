import type { Plugin } from 'vite';
import type { Lib, VitePluginComponentImport, Source } from './types';
import { transformAsync, PluginObj, PluginItem } from '@babel/core';
import { createFilter } from '@rollup/pluginutils';
import * as changeCase from 'change-case';
// @ts-ignore
import { addSideEffect } from '@babel/helper-module-imports';
import { ChangeCaseType, LibraryNameChangeCase } from './types';
import path from 'path';
import { normalizePath } from 'vite';

function resolveNodeModules(...dir: string[]) {
  return normalizePath(path.join(process.cwd(), 'node_modules', ...dir));
}

function needTransform(code: string, libs: Lib[]) {
  return !libs.every(({ libraryName }) => {
    return !new RegExp(`('${libraryName}')|("${libraryName}")`).test(code);
  });
}

function getChangeCaseFileName(importedName: string, libraryNameChangeCase: LibraryNameChangeCase) {
  try {
    return changeCase[libraryNameChangeCase as ChangeCaseType](importedName);
  } catch (error) {
    return importedName;
  }
}

function createBabelStyleImportPlugin({ types }: Record<string, any>): PluginObj {
  return {
    name: 'babel-plugin-style-import',
    visitor: {
      ImportDeclaration(path, source) {
        const {
          opts: { libs },
        } = source as Source;
        if (!libs) return;

        const { node } = path;
        const { value } = node.source;
        const lib = libs.find((item) => item.libraryName === value);
        if (!lib) return;

        const { libraryName, resolveStyle, esModule, libraryNameChangeCase = 'paramCase' } = lib;

        if (!resolveStyle || typeof resolveStyle !== 'function') return;

        if (!libraryName || value !== libraryName) return;

        for (const specifier of node.specifiers) {
          if (types.isImportSpecifier(specifier)) {
            const importedName = (specifier as any).imported.name;

            const name = getChangeCaseFileName(importedName, libraryNameChangeCase);
            let importers = resolveStyle(name);
            if (esModule) {
              importers = resolveNodeModules(importers);
            }
            if (Array.isArray(importers)) {
              importers.forEach((importer) => {
                addSideEffect(path, importer);
              });
            } else {
              addSideEffect(path, importers);
            }
          }
        }
      },
    },
  };
}

export default (options: VitePluginComponentImport): Plugin => {
  const {
    include = ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    exclude = 'node_modules/**',
    libs = [],
  } = options;

  const filter = createFilter(include, exclude);

  let needSourceMap = true;

  return {
    name: 'vite:style-import',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
    },

    async transform(code, id) {
      if (!filter(id) || !needTransform(code, libs)) return code;

      const plugins: PluginItem[] = [[createBabelStyleImportPlugin, { libs }]];
      if (id.endsWith('.tsx')) {
        plugins.push([
          require('@babel/plugin-transform-typescript'),
          { isTSX: true, allowExtensions: true },
        ]);
      }

      const babelResult = await transformAsync(code, {
        plugins,
        sourceFileName: id,
        sourceMaps: needSourceMap,
      });

      return {
        code: (babelResult && babelResult.code) || code,
        map: (babelResult && babelResult.map) || null,
      };
    },
  };
};
