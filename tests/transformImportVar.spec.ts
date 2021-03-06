import { transformImportVar } from '../src';
import { init } from 'es-module-lexer';

test('transformImportVar test', async () => {
  await init;
  const res = transformImportVar(`import { Button, Alert } from 'lib'`);
  expect(res).toStrictEqual(['Button', 'Alert']);
});
