function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

import React from 'react';
export const Bar = () => {
  const Foo = _interopRequireDefault(require('./foo')).default;

  return <Foo />;
};
