import React from 'react'
import Link from 'next/link'
import Pouchdb from 'pouchdb-browser'

export default class MyPage extends React.Component {
  static async getInitialProps (oy) {
    // server side
    if (oy && oy.req) { return { rows: false } }

    const db = new Pouchdb('mooya')
    // await db.post({ now: new Date().toISOString(), one: 'thing' })
    return db.allDocs()
  }

  rows () {
    if (this.props.rows) {
      return this.props.rows.map((row) => <dl>
        <dt>{row.id}</dt>
        <dd>{row.value.rev}</dd>
      </dl>)
    }

    return <p>Server side...</p>
  }

  render () {
    return <div>
      <h2>
        <Link href='/'>
          <a>ROWS</a>
        </Link>
      </h2>
      {this.rows()}
    </div>
  }
}
