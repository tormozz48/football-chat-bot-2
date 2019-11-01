"use strict";

module.exports = {
  types: [
    { value: "ci", name: "ci: CI settings" },
    { value: "feat", name: "feat: Add new feature" },
    { value: "fix", name: "fix: Issue fix" },
    { value: "other", name: "other: Other changes"},
    { value: "revert", name: "revert: Revert to previous code version" }
  ],

  scopes: [
    { name: "source" },
    { name: "tests" }
  ],

  scopeOverrides: {
    content: [
      {name: 'source'},
    ],
    tests: [
      {name: 'tests'}
    ]
  },

  messages: {
    type: "What changes do you make ?",
    scope: "Select scope which your changes are related to:",
    customScope: "Select you scope (optional):",
    subject: "Write commit subject:",
    body: 'Write detailed commit description:',
    confirmCommit: "Do you satisfied by given result ?"
  },

  allowCustomScopes: true,
  allowBreakingChanges: false,
  footerPrefix: "Meta:",
  subjectLimit: 120
};