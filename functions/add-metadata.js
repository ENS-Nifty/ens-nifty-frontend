import faunadb, {query as q} from 'faunadb';
import moment from 'moment';
import web3Utils from 'web3-utils';
import {registrarContract} from './config/contracts';

require('dotenv').config();

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
  registrarContract.methods
    .entries(hash)
    .call()
    .then(entryInfo => {
      const dateRegistered = moment(+entryInfo[2] * 1000).format('MM/DD/YYYY');
      const lockedEther = web3Utils.fromWei(entryInfo[3]);
      return client.query(
        q.Let(
          {ref: q.Match(q.Index('domain_by_label_hash'), hash)},
          q.If(
            q.Exists(q.Var('ref')),
            [
              'updated',
              q.Update(q.Select('ref', q.Get(q.Var('ref'))), {
                data: {dateRegistered, lockedEther},
              }),
            ],
            [
              'created',
              q.Create(q.Class('domains'), {
                data: {label, hash, dateRegistered, lockedEther},
              }),
            ],
          ),
        ),
      );
    })
    .then(() => cb(null, {statusCode: 200, body: 'OK'}))
    .catch(err =>
      cb(null, {statusCode: 400, body: err.name + ':' + err.message}),
    );
};
