function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Foo = require('./foo').Foo;

const FOO = _interopRequireDefault(require('./bar')).default;

class Bar {
  static FOO = FOO;
  state = {
    Foo: Foo,
  };

  constructor() {
    this.test = 'test';
  }
}
