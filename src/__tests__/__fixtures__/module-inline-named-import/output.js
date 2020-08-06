export const runFoo = () => {
  const foo = require('./foo').foo;

  return foo();
};
