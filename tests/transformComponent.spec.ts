import vitePluginComponentImport from '../src';
import { Lib } from '../src/types';

const transformCodeTemplate = `import { libName } from 'lib';
import { libName2 } from 'lib2';`;

const createVitePluginComponentImport = (libs: Lib[]) => {
  const { configResolved, transform } = vitePluginComponentImport({
    libs,
  });

  configResolved!({ isProduction: true, build: {} } as any);

  return ({ transform } as unknown) as {
    transform: (
      code: string,
      id: string
    ) => Promise<{
      map: string | null;
      code: string;
    }>;
  };
};

test('use transformComponent', async () => {
  const { transform } = createVitePluginComponentImport([
    {
      libraryName: 'lib',
      resolveComponent: (name) => name,
      transformComponentImportName: (name) => `{ ${name} }`,
    },
  ]);

  const res = await transform(transformCodeTemplate, 'lib_path.ts');

  expect(res).toStrictEqual({
    map: null,
    code: `
import { libName } from 'lib-name';\n
import { libName2 } from 'lib2';`,
  });
});

test('do not use transformComponent', async () => {
  const { transform } = createVitePluginComponentImport([
    {
      libraryName: 'lib',
      resolveComponent: (name) => name,
    },
  ]);

  const res = await transform(transformCodeTemplate, 'lib_path.ts');

  expect(res).toStrictEqual({
    map: null,
    code: `
import libName from 'lib-name';\n
import { libName2 } from 'lib2';`,
  });
});
