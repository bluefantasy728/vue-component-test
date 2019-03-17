module.exports = {
  root: true,
  env: {
    browser: false,
    node: false,
  },
  extends: [
    'plugin:vue/essential',
    //'@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 0,
    'max-len': 0,
    'no-param-reassign': 0,
    'object-property-newline': 'error',
    'arrow-parens': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
