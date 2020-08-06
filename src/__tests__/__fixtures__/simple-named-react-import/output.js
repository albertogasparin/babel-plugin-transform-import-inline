import React from 'react';
export const Foo = () => {
  const Bar = require('./bar').Bar;

  return <Bar />;
};
