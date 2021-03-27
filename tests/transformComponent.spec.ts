import vitePluginComponentImport from '../src';
import { init } from 'es-module-lexer';
import { Lib } from '../src/types';

const createVitePluginComponentImport = (libs: Lib[]) =>
  (vitePluginComponentImport({
    libs,
  }) as unknown) as {
    configResolved: (opts: { isProduction: boolean; build: Record<string, any> }) => void;
    transform: (
      code: string,
      id: string
    ) => {
      map: string | null;
      code: string;
    };
  };

test('use transformComponent', async () => {
  await init;

  const { transform } = createVitePluginComponentImport([
    {
      libraryName: 'lib',
      transformComponentImportName: (name: string) => `{ ${name} }`,
    },
  ]);

  const res = await transform(`import { libName } from 'lib'`, 'lib_path.ts');

  expect(res).toStrictEqual({ map: null, code: "import { libName } from 'lib'\n" });
});

test('do not use transformComponent', async () => {
  await init;

  const { transform, configResolved } = createVitePluginComponentImport([
    {
      libraryName: 'lib',
      resolveComponent: (name) => name,
    },
  ]);

  configResolved({ isProduction: true, build: {} });

  const res = await transform(
    `import { libName } from 'lib';
import { libName2 } from 'lib2';`,
    'lib_path.ts'
  );

  expect(res).toStrictEqual({
    map: null,
    code: `
import libName from 'lib-name';\n
import { libName2 } from 'lib2';`,
  });
});
