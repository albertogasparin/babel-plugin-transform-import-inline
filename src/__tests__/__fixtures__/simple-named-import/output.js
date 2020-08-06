export const runFoo = () => {
  const foo = require('./foo').foo;

  foo();
  foo();
};
