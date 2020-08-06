import type { FlowType } from './flow-type';
import { foo } from './bar';

function bar(flow: FlowType) {
  return foo(flow);
}
