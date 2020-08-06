import { foo } from './foo';
import { toString } from 'lodash';

export const runFoo = () => {
  foo();
  foo();
  toString();
};
