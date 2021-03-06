import Document, { Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const {html, head, errorHtml, chunks} = renderPage()
    const styles = flush()
    return { html, head, errorHtml, chunks, styles }
  }

  render () {
    return <html lang='fr' manifest='/the.appcache'>
      <head>
        <meta charSet='utf-8' />
      </head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  }
}
