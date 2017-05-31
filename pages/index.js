import React from 'react'
import Link from 'next/link'
import Pouchdb from 'pouchdb-browser'

export default class MyPage extends React.Component {
  static async getInitialProps (oy) {
    if (oy && oy.req) {
      return { rows: false }
    }

    const db = new Pouchdb('mooya')
    // await db.post({ now: new Date().toISOString(), one: 'thing' })
    return db.allDocs()
  }

  render () {
    return <div>
      <h2>
        <Link href='/'>
          <a>ROWS</a>
        </Link>
      </h2>
      <pre>
        {JSON.stringify(this.props.rows, null, '  ')}
      </pre>
    </div>
  }
}

