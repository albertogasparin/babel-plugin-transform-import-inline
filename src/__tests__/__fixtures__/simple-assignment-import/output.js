export const baz = () => {
  const foo = require('foo').foo;

  const ff = foo;

  const bar = require('bar').bar;

  const bb = bar;

  const bazD = require('baz').baz;

  const baz = bazD;
};
