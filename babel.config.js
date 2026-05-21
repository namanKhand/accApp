module.exports = function (api) {
  api.cache(true);
  const isProduction = process.env.BABEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@': './src'
        }
      }],
      // Strip all console.* calls in production builds (App Store / TestFlight)
      ...(isProduction ? [['transform-remove-console', { exclude: ['error', 'warn'] }]] : []),
    ]
  };
};
