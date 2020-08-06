function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

export const runFoo = () => {
  const foo = _interopRequireDefault(require('./foo')).default;

  return foo();
};
