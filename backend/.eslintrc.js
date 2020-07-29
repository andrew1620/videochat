module.exports = {
  "rules": {
    "indent": ["error", 4],
    "max-len": ["error", { "code": 120 }],
    "no-plusplus": "off",
    "linebreak-style": ["error", "unix"],
    "no-underscore-dangle": 0,
    "array-callback-return": 0
  },
  "env": {
    "node": true,
    "mocha": true
  },
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module"
  },
  "extends": [
    "airbnb-base"
  ]

};
