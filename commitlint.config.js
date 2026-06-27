/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "refactor", // Code refactor (no feature, no fix)
        "docs", // Documentation only
        "style", // Formatting, missing semicolons, etc.
        "test", // Adding or updating tests
        "build", // Build system or dependencies
        "ci", // CI configuration
        "perf", // Performance improvement
        "chore", // Maintenance tasks
        "revert", // Revert a previous commit
      ],
    ],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
  },
};
