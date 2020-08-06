import { Foo } from './foo';
import FOO from './bar';

class Bar {
  static FOO = FOO;

  state = {
    Foo: Foo,
  };
  constructor() {
    this.test = 'test';
  }
}
