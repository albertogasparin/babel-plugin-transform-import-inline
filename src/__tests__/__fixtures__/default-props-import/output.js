var Eager = require('./eager').Eager;

export const Baz = ({
  foo = require('./foo').foo,
  Bar = require('./bar').Bar,
  val = require('./val-func').default(),
  eager = __jsx(Eager, null),
  deepEager = __jsx(Eager.Foo, null),
  deeperEager = __jsx(Eager.Foo.Bar, null),
}) => {
  foo();
  return __jsx(Bar, {
    val: val,
  });
};
