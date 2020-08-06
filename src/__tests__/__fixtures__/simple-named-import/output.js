export const runFoo = () => {
  const toString = require('lodash').toString;

  const foo = require('./foo').foo;

  foo();
  foo();
  toString();
};
