'use strict'

// core
const util = require('util')

// npm
const Koa = require('koa')
const Router = require('koa-router')

module.exports = (app) => {
  const handle = app.getRequestHandler()
  const router = new Router()
  const server = new Koa()
  const listen = util.promisify(server.listen.bind(server))
  const dev = server.env !== 'production'

  // reverse order
  const middlewares = [
    router.routes(),
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
