import React from 'react'
import Link from 'next/link'
import Header from '../components/progress'
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
      return this.props.rows.map((row) => <div>
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
