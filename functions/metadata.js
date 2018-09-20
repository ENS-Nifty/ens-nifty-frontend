// image (ENS logo but hue rotated by modulo of the hash)
// block registered (?)
import moment from 'moment';
import addresses from './config/addresses';
import web3Utils from 'web3-utils';
import faunadb, {query as q} from 'faunadb';
import {registrarContract, niftyContract} from './config/contracts';
import {nodeFromLabelHash} from './helpers/hashes';
import BigNumber from 'bignumber.js';

require('dotenv').config();

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

function getOwner(labelHash) {
  return niftyContract.methods
    .ownerOf(labelHash)
    .call()
    .catch(() => `0x${'0'.repeat(40)}`);
}

function mod(numberOne, numberTwo) {
  return BigNumber(`${numberOne}`)
    .mod(BigNumber(`${numberTwo}`))
    .toString();
}

async function getNameAttributes(labelHash) {
  const owner = await getOwner(labelHash);
  const entryInfo = await registrarContract.methods.entries(labelHash).call();
  const dateRegistered = entryInfo[2];
  const lockedEther = entryInfo[3];
  return {
    dateRegistered: moment(+dateRegistered * 1000).format('MM/DD/YYYY'),
    lockedEther: web3Utils.fromWei(lockedEther),
    owner,
  };
}

exports.handler = (event, context, cb) => {
  if (!event.queryStringParameters || !event.queryStringParameters.hash) {
    return cb(null, {statusCode: 500, body: 'Hash not provided'});
  }
  const labelHash = event.queryStringParameters.hash;
  return client
    .query(q.Get(q.Match(q.Index('domain_by_label_hash'), labelHash)))
    .then(ret => ret.data.label)
    .then(label =>
      getNameAttributes(labelHash).then(nameAttr => {
        const hue = mod(labelHash, 360);
        const tokenID = BigNumber(labelHash).toString(10);
        cb(null, {
          statusCode: 200,
          body: JSON.stringify({
            name: label + '.eth',
            image: `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`,
            description: `ENS domain bought on ${nameAttr.dateRegistered} for ${
              nameAttr.lockedEther
            } ether. The owner of the '${label}.eth' token may untokenize the name for use at ensnifty.com`,
            external_url: `https://etherscan.io/token/${
              addresses.nifty
            }?a=${tokenID}`,
            background_color: 'FFFFFF',
            attributes: nameAttr,
          }),
        });
      }),
    )
    .catch(err =>
      cb(null, {statusCode: 400, body: err.name + ':' + err.message}),
    );
};
