module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@dtos': './src/dtos',
            '@assets': './src/assets',
            '@views': './src/views',
            '@utils': './src/utils',
            '@infra': './src/infra',
            '@hooks': './src/hooks',
            '@view-models': './src/view-models',
            '@routes': './src/routes',
            '@mappers': './src/mappers',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
