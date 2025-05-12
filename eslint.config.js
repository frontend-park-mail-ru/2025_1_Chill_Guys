"use strict";

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser } },
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/shared/**"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }

  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
      "prettier/prettier": [  //or whatever plugin that is causing the clash
        "error",
        {
          "tabWidth": 4
        }
      ]
    },
  },
];
