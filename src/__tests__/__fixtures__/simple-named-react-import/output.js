import React from 'react';
export const Foo = () => {
  const Bar = require('./bar').Bar;

  return __jsx(Bar, null);
};
