'use strict'

// core
const util = require('util')

// npm
const conditional = require('koa-conditional-get')
const glob = util.promisify(require('glob'))

const cachedPages = async (app) => {
  const files = await glob('pages/*.js', { ignore: 'pages/_*.js' })
  const pages = []
  files
    .map((x) => x.replace(/^pages\/(.+)\.js$/, 'page/$1'))
    .map((x) => x === 'page/index' ? 'page/' : x)
    .forEach((x) => { pages.push(x.slice(4), ['/_next', app.buildId, x].join('/')) })
  return pages
}

const cachedStatics = async () => {
  const files = await glob('static/**', { nodir: true })
  return files.map((x) => `/${x}`)
}

const manifestFile = async (app) => {
  const thePages = await cachedPages(app)
  const theStatics = await cachedStatics()
  const files = [
    ...thePages,
    ...theStatics,
    `/_next/${app.buildId}/page/_error/index.js`,
    `/_next/${app.buildStats['app.js'].hash}/app.js`
  ]
  return `CACHE MANIFEST
# ${app.buildId} - ${app.buildStats['app.js'].hash}

CACHE:
${files.join('\n')}

NETWORK:
*
`
}
// NETWORK: /db/*

module.exports = (app, router) => {
  router.get('/the.appcache', conditional(), async (ctx) => {
    const etag = app.buildId
    const type = 'text/cache-manifest'
    const body = await manifestFile(app)
    Object.assign(ctx, { etag, type, body })
  })
}
