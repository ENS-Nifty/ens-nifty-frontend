import addresses from './config/addresses';
import faunadb, {query as q} from 'faunadb';
import {registrarContract, niftyContract} from './config/contracts';
import {nodeFromLabelHash} from './helpers/hashes';
import BigNumber from 'bignumber.js';

require('dotenv').config();

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

function mod(numberOne, numberTwo) {
  return BigNumber(`${numberOne}`)
    .mod(BigNumber(`${numberTwo}`))
    .toString();
}

exports.handler = (event, context, cb) => {
  if (!event.queryStringParameters || !event.queryStringParameters.hash) {
    return cb(null, {statusCode: 500, body: 'Hash not provided'});
  }
  const labelHash = event.queryStringParameters.hash;
  return client
    .query(q.Get(q.Match(q.Index('domain_by_label_hash'), labelHash)))
    .then(ret => ret.data)
    .then(data => {
      const hue = mod(labelHash, 360);
      const tokenID = BigNumber(labelHash).toString(10);
      const lockedEther = data.lockedEther ? data.lockedEther : '?';
      const dateRegistered = data.dateRegistered ? data.dateRegistered : '?';
      const label = data.label ? data.label : '?';
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          name: label + '.eth',
          image: `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`,
          description: `ENS domain bought on ${dateRegistered} for ${lockedEther} ether. The owner of the '${label}.eth' token may untokenize the name for use at ensnifty.com`,
          external_url: `https://etherscan.io/token/${
            addresses.nifty
          }?a=${tokenID}`,
          background_color: 'FFFFFF',
          attributes: {
            lockedEther,
            dateRegistered,
          },
        }),
      });
    })
    .catch(err =>
      cb(null, {statusCode: 400, body: err.name + ':' + err.message}),
    );
};
