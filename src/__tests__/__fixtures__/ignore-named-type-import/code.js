import { type Foo, foo } from './foo';

export const bar = (): Foo => {
  const f: Foo = foo();
  return f;
};
