require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var bodyParser = require('body-parser')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(bodyParser.json())

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

app.get('/fetchControl', (req, res, next) => {
  res.json({
    success: true,
    tableData: [
      {
        control_descript: '事件描述blablabla',
        control_time: 1491807775,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 12,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1489293771,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 33,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1488498171,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 121,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1483368171,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 4,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1482378171,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 67,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1480736571,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 311,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1480390971,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 30,
        event: 'xx事件'
      },
      {
        control_descript: '事件描述blablabla',
        control_time: 1478581881,
        source: '重点敏感舆情',
        control_type: '调控管控',
        control_range: '全网',
        sample_type: '信息',
        number: 23,
        event: 'xx事件'
      }
    ]
  })
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
