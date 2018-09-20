import web3Utils from 'web3-utils';
import faunadb, {query as q} from 'faunadb';

require('dotenv').config()

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = (event, context, cb) => {
  if (!event.body || !JSON.parse(event.body).label) {
    return cb(null, {
      statusCode: 500,
      body: 'Label not provided',
    });
  }
  const label = JSON.parse(event.body).label;
  const hash = web3Utils.soliditySha3(label);
  return client
    .query(
      q.Create(q.Class('domains'), {
        data: {label, hash},
      }),
    )
    .then(ref =>
      cb(null, {
        statusCode: 200,
        body: 'OK',
      }),
    )
    .catch(err => cb(null, {statusCode: 400, body: err.name + ':' + err.message}));
};
