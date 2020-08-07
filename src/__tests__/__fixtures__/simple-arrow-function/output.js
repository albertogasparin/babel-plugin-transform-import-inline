export const func = () => {
  var foo = require('./bar').foo;

  return foo();
};
