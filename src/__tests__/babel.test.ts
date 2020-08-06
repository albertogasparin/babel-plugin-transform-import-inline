// @ts-ignore - babel-plugin-tester doesn't export types
import pluginTester from 'babel-plugin-tester';
import path from 'path';
import plugin from '../';

pluginTester({
  plugin,
  pluginName: 'babel-plugin-transform-import-inline',
  fixtures: path.join(__dirname, '__fixtures__'),
  snapshot: true,
});
