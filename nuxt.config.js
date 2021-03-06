const bodyParser = require('body-parser')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const sessions = require('client-sessions')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '程序猿的升级之路',
    titleTemplate: '猿码集-%s',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'author', content: 'zhangjun521ly@gmail.com' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '猿码集-程序猿代码聚集地' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/normalize/8.0.0/normalize.min.css' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.css'],
  /**
   * Build configuration
   */
  plugins: [{ src: '~/plugins/editor', ssr: false }, {src: '~/plugins/element-ui'}, '~/plugins/axios', '~/plugins/filter', { src: '~/plugins/swiper.js', ssr: false }],
  /**
   * loading configuration
   */
  loading: {
    color: '#00FF00'
  },
  /*
  ** Add axios globally
  */
  build: {
    plugins: [
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       warnings: false,
      //       drop_console: true,
      //       pure_funcs: ['console.log']
      //     }
      //   },
      //   sourceMap: false,
      //   parallel: true
      // })
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    filenames: {
      app: '[name].[chunkhash].js'
    },
    extractCSS: true,
    analyze: true,
    babel: {
      presets: ['es2015', 'stage-2'],
      plugins: [['component', [
        {
          'libraryName': 'element-ui',
          'styleLibraryName': 'theme-chalk'
        }
      ]], 'transform-async-to-generator', 'transform-runtime'],
      comments: true
    },
    // vendor: ['swiper'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.entry['polyfill'] = ['babel-polyfill']
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.externals = {
        Clipboard: 'Clipboard'
      }
      // if (ctx.isClient) {
      //   const { vendor } = config.entry
      //   const vendor2 = ['vue']
      //   config.entry.vendor = vendor.filter(v => !vendor2.includes(v))
      //   config.entry.vendor2 = vendor2
      //   const plugin = config.plugins.find((plugin) => ~plugin.chunkNames.indexOf('vendor'))
      //   const old = plugin.minChunks
      //   plugin.minChunks = function (module, count) {
      //     return old(module, count) && !(/(vue)|(vuetify)/).test(module.context)
      //   }
      // }
    }
  },
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    proxy: true,
    credentials: true,
    proxyHeaders: true,
    retry: { retries: 3 }
  },
  proxy: {
    '/api/': 'https://gitee.com',
    '/user/': 'http://127.0.0.1:3000'
  },
  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    sessions({
      cookieName: 'myBlog',
      secret: 'zjargadeeblargbblog',
      duration: 24 * 60 * 60 * 1000 * 7,
      activeDuration: 1000 * 60 * 5
    }),
    // API middleware
    '~/api/index.js'
  ],
  router: {
    extendRoutes (routers) {
      // 路由有关的内容
      // routers.forEach(e => {
      //   if (e.name === 'id') {
      //     e.path = e.path + '.html'
      //   }
      // })
    }
  }
}
