import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  // Base config for all JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node // Add Node.js globals
      }
    },
    plugins: { js },
    extends: ["js/recommended"]
  },
  
  // Config specifically for test files
  {
    files: ["**/tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest // Add Jest globals
      }
    },
    rules: {
      "no-unused-vars": "off" // Disable unused vars rule for tests
    }
  },
  
  // Ignore patterns (equivalent to .eslintignore)
  {
    ignores: [
      "node_modules/",
      "coverage/"
    ]
  }
]);