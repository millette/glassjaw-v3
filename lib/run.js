'use strict'

// core
const util = require('util')

// npm
const Koa = require('koa')
const Router = require('koa-router')
// const proxy = require('koa-proxies')

module.exports = (app) => {
  const handle = app.getRequestHandler()
  const router = new Router()
  const server = new Koa()
  const listen = util.promisify(server.listen.bind(server))
  const dev = server.env !== 'production'

/*
  const dbProxy = proxy('/db', {
    changeOrigin: true,
    target: 'http://localhost:5993',
    preserveHeaderKeyCase: true,
    rewrite: (path) => path.split('/').slice(2).join('/'),
    xfwd: true,
    logs: true
  })
*/

  // reverse order
  const middlewares = [
    router.routes(),
    // dbProxy,
    async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    }
  ]

  if (!dev) { require('./appcache')(app, router) }

  router.get('*', async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  // FIXME: temporary debugging...
  if (!dev || dev) {
    middlewares.push(
      async (ctx, next) => {
        const start = Date.now()
        await next()
        const ms = Date.now() - start
        console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
      }
    )
  }

  middlewares.reverse().forEach(server.use.bind(server))
  return listen(3000).then(() => '> Ready on http://localhost:3000')
}
