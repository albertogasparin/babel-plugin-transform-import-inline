export const runFoo = () => {
  const foo = require('./foo').default;

  return foo();
};
