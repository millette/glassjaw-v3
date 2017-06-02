'use strict'

// npm
const nextjs = require('next')

// self
const run = require('./lib/run')

const app = nextjs({ dev: process.env.NODE_ENV !== 'production' })

app
  .prepare()
  .then(() => run(app))
  .then(console.log)
