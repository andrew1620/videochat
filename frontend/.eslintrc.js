module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "globals": {
    "__CONFIG__": true,
    "__ENV__": true
  },
  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      // Enabled object spread
      "experimentalObjectRestSpread": true
    }
  },
  // Rule changes from Airbnb's eslint config
  "rules": {
    "react/prop-types": "warn",
    "linebreak-style": ["error", "unix"],
    "indent": [
      "error",
      4,
      {
        "SwitchCase": 1,
        "ignoredNodes": ["TemplateLiteral"]
      }
    ],
    "max-len": 0,
    "no-plusplus": 0,
    "no-underscore-dangle": 0,
    "operator-linebreak": [
      "error",
      "after",
      {
        "overrides": {
          "?": "before",
          ":": "before"
        }
      }
    ],
    "react/jsx-indent": ["error", 4],
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-props-no-spreading": ["warn"],
    "react/forbid-prop-types": 0,
    "import/prefer-default-export": 0,
    "template-curly-spacing": 0,
    "array-callback-return": 0
  }

};
