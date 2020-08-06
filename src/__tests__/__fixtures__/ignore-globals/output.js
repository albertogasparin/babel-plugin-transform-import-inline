function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const foo = () => {
  const toString = _interopRequireDefault(require('to-string')).default;

  return toString(1).toLowerCase();
};
