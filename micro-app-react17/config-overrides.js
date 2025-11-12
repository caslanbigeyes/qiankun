module.exports = {
  webpack: (config) => {
    config.output.library = `react17App`;
    config.output.libraryTarget = 'umd';
    config.output.globalObject = 'window';
    config.output.chunkLoadingGlobal = `webpackJsonp_react17App`;

    return config;
  },

  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      config.open = false;
      config.hot = false;
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      };

      return config;
    };
  },
};
