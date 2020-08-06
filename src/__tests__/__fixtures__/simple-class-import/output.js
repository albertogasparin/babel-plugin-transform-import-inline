const FOO = _interopRequireDefault(require('./bar')).default;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Foo = require('./foo').Foo;

class Bar {
  static FOO = FOO;
  state = {
    Foo: Foo,
  };

  constructor() {
    this.test = 'test';
  }
}
