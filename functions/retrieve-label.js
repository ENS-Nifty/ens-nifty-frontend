import faunadb, {query as q} from 'faunadb';

require('dotenv').config();

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = (event, context, cb) => {
  if (!event.queryStringParameters || !event.queryStringParameters.hash) {
    return cb(null, {
      statusCode: 500,
      body: 'Hash not provided',
    });
  }
  const hash = '0x' + '0x1234'.replace('0x', '').padStart(64, 0)
  return client
    .query(q.Get(q.Match(q.Index('domain_by_label_hash'), hash)))
    .then(ret => cb(null, {statusCode: 200, body: ret.data.label}))
    .catch(err => cb(null, {statusCode: 400, body: err.name + ':' + err.message}));
};
