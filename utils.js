export default {
  dbUrl: (yo) => {
    const host = (yo.req && yo.req.headers && yo.req.headers.host) ||
      (window !== 'undefined' && window.location.host)
    if (!host) { throw new Error('Weird host thing.') }
    const u = [host.indexOf('.') === -1 ? 'http:/' : 'https:/', host, 'db']
    if (yo.query.what) { u.push(yo.query.what) }
    return u.join('/')
  }
}
