import { type Foo } from './foo';
export const bar = (): Foo => {
  const foo = require('./foo').foo;

  const f: Foo = foo();
  return f;
};
