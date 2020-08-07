export default function () {
  const di = require('react-magnetic-di').di;

  const foo = require('foo').foo;

  const [_foo] = di([foo], null);

  _foo();
}
