import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

/**
 * Flat config. `eslint-config-next` ships one directly, so it can be spread in
 * without the compat shim. `eslint-config-prettier` goes last so formatting
 * rules never fight Prettier.
 */
export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "data/**",
      "public/**",
      "next-env.d.ts",
      "*.config.mjs",
    ],
  },
  ...next,
  prettier,
  {
    rules: {
      /* Apostrophes and quotes in prose copy are deliberate. */
      "react/no-unescaped-entities": "off",
    },
  },
];
