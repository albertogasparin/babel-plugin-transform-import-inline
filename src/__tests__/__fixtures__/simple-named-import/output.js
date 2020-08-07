export const runFoo = () => {
  const foo = require('./foo').foo;

  foo();
  foo();

  const toString = require('lodash').toString;

  toString();
};
