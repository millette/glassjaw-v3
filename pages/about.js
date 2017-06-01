import React from 'react'
import Link from 'next/link'
import Header from '../components/progress'

export default () => <div>
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
  <h1>About</h1>
</div>
