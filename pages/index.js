import React from 'react'
import Link from 'next/link'
import Header from '../components/progress'
import Pouchdb from 'pouchdb-core'

Pouchdb.plugin(require('pouchdb-adapter-http'))

const cfg = {
  db: false,
  remote: 'http://localhost:5993/gj-v3',
  local: 'mooya'
}

export default class MyPage extends React.Component {
  static async getInitialProps (oy) {
    if (oy && oy.req) {
      // server side
      if (!cfg.db) { cfg.db = new Pouchdb(cfg.remote) }
    } else {
      // client side
      if (!cfg.db) {
        Pouchdb
          .plugin(require('pouchdb-adapter-idb'))
          .plugin(require('pouchdb-adapter-websql'))
          .plugin(require('pouchdb-replication'))
          .sync(cfg.remote, cfg.local, { live: true, retry: true })
          .on('active', () => console.log('ACTIVE'))
          .on('change', (info) => console.log('CHANGE', info))
          .on('complete', (info) => console.log('COMPLETE', info))
          .on('paused', (err) => console.log('PAUSED', err))
          .on('denied', (err) => console.log('DENIED', err))
          .on('error', (err) => console.log('ERROR', err))
        cfg.db = new Pouchdb(cfg.local)
      }
    }
    return cfg.db.allDocs()
  }

  rows () {
    if (this.props.rows) {
      return this.props.rows.map((row) => <div key={row.id}>
        <p>The content!</p>
        <dl>
          <dt>{row.id}</dt>
          <dd>{row.value.rev}</dd>
        </dl>
      </div>)
    }

    return <div>
      <p>Server side...</p>
      <p>Content to come.</p>
    </div>
  }

  render () {
    return <div>
      <Header />
      <ul>
        <li>
          <Link href='/'>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href='/about'>
            <a>About</a>
          </Link>
        </li>
      </ul>
      <h1>Home</h1>
      {this.rows()}
    </div>
  }
}
