module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false,
      },
    ],
    // [
    //   '@babel/plugin-transform-runtime',
    //   {
    //     helpers: true,
    //     regenerator: true,
    //   },
    // ],
  ],
  ignore: [
    './node_modules',
  ],
};
