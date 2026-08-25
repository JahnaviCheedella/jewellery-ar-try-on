import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];
