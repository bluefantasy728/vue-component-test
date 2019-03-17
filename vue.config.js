module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/app' : '/',
  outputDir: 'app',

  css: {
    modules: false,
    loaderOptions: {
      sass: {
        data: '@import "@/scss/variables.scss";',
      },
    },
  },

  devServer: {
    port: 80,
    host: '0.0.0.0',
    disableHostCheck: true,
    // proxy: {
    //   '/api': {
    //     // target: 'http://192.168.1.56:8081',
    //     // target: 'http://192.168.1.56:8080',
    //     target: 'http://192.168.1.84:8080',
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //     // ws: true, //WebSocket
    //     changeOrigin: true,
    //   },
    // },
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-cn',
      fallbackLocale: 'zh-cn',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
