export const fn = async () => {
  var fetch = require('./fetch').fetch;

  return (await fetch()).foo();
};
