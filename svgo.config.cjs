module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: {
            minify: false,
            remove: false
          }
        }
      }
    }
  ]
};
