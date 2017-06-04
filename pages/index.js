import React from 'react'
import Link from 'next/link'
import Header from '../components/progress'
import Pouchdb from 'pouchdb-core'

Pouchdb.plugin(require('pouchdb-adapter-http'))

const cfg = {
  db: false,
  remote: 'http://localhost:3000/db/gj-v3',
  local: 'mooya'
}

export default class MyPage extends React.Component {
  static async getInitialProps (oy) {
    // server side
    if (oy && oy.req) {
      if (!cfg.db) { cfg.db = new Pouchdb(cfg.remote) }
    } else {
      if (!cfg.db) {
        Pouchdb
          .plugin(require('pouchdb-adapter-idb'))
          .plugin(require('pouchdb-adapter-websql'))
          .plugin(require('pouchdb-replication'))
        cfg.db = new Pouchdb(cfg.local)
      }
      cfg.db.remove('job', '1-967a00dff5e02add41819138abb3284d')
      Pouchdb.sync(cfg.remote, cfg.local)
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
