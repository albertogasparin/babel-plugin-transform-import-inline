function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const fooDI = require('./foo').foo;

const BarDI = require('./bar').Bar;

const Eager = require('./eager').Eager;

const valFunc = _interopRequireDefault(require('./val-func')).default;

export const Baz = ({
  foo = fooDI,
  Bar = BarDI,
  val = valFunc(),
  eager = <Eager />,
  deepEager = <Eager.Foo />,
  deeperEager = <Eager.Foo.Bar />,
}) => {
  foo();
  return <Bar val={val} />;
};
