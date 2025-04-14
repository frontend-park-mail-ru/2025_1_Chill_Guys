"use strict";

import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      "no-undef": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
];
