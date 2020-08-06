export const baz = () => {
  const bazD = require('baz').baz;

  const bar = require('bar').bar;

  const foo = require('foo').foo;

  const ff = foo;
  const bb = bar;
  const baz = bazD;
};
