import type { FlowType } from './flow-type';

function bar(flow: FlowType) {
  const foo = require('./bar').foo;

  return foo(flow);
}
