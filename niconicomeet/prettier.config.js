module.exports = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.{md,yml}',
      options: {
        printWidth: 80,
        semi: false,
        singleQuote: false,
        trailingComma: 'none',
      },
    },
  ],
}
