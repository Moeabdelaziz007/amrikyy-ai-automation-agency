// postcss.config.js - Enhanced Configuration
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false,
      },
    },
  },
};
