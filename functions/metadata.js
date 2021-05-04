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

function rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther) {
  return {
    image_url: imageUrl,
    home_url: homeUrl,
    properties: [
      {key: 'locked-ether', value: parseFloat(lockedEther), type: 'integer'},
      {key: 'date-registered', value: dateRegistered, type: 'string'},
    ],
  };
}

function openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther) {
  return {
    image: imageUrl,
    external_url: homeUrl,
    background_color: 'FFFFFF',
    attributes: {lockedEther: parseFloat(lockedEther), dateRegistered},
  };
}

exports.handler = (event, context, cb) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  };

  let hash = event.path.substr(event.path.lastIndexOf('/') + 1) // hash

  if (!hash) {
    return cb(null, {statusCode: 500, body: 'Hash not provided'});
  }

  if (hash.toLowerCase().substr(0, 2) !== '0x') {
    let foo = new BigNumber(hash)
    hash = '0x' + foo.toString(16)
  }
  hash =
    '0x' +
    hash
      .toLowerCase()
      .replace('0x', '')
      .padStart(64, '0');

  const labelHash = hash.toLowerCase();

  // timdaub.eth
  let timdaub = '0x3bf87c5c609b6a0e5b0daa400c18c396b1db1c927e55a0e1d61405b756e2b0b8'
  if (labelHash == timdaub.toLowerCase()) {
    let imageUrl = 'https://picsum.photos/200'
    let homeUrl = 'https://google.com'
    cb(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: 'foo bar',
        description: `foo baz`,
        image: imageUrl,
        external_url: homeUrl,
        // background_color: 'FFFFFF',
        // attributes: { lockedEther: parseFloat(lockedEther), dateRegistered }
        image_url: imageUrl,
        home_url: homeUrl,
        // properties: [
        //   { key: 'locked-ether', value: parseFloat(lockedEther), type: 'integer' },
        //   { key: 'date-registered', value: dateRegistered, type: 'string' }
        // ]
      }),
    });
  }
  
  return client
    .query(q.Get(q.Match(q.Index('domain_by_label_hash'), labelHash)))
    .then(ret => ret.data)
    .then(data => {
      const hue = mod(labelHash, 360);
      const tokenID = BigNumber(labelHash).toString(10);
      const lockedEther = data.lockedEther ? data.lockedEther : '?';
      const dateRegistered = data.dateRegistered ? data.dateRegistered : '?';
      const label = data.label ? data.label : '?';
      const homeUrl = `https://etherscan.io/token/${
        addresses.nifty
      }?a=${tokenID}`;
      const imageUrl = `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`;
      cb(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          name: label + '.eth',
          description: `ENS domain bought on ${dateRegistered} for ${lockedEther} ether. The owner of the '${label}.eth' token may untokenize the name for use at ensnifty.com`,
          ...rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
          ...openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
        }),
      });
    })
    .catch(err => {
      if (err.name === 'NotFound' && err.message === 'instance not found') {
        const labelHash = hash.toLowerCase();
        const hue = mod(labelHash, 360);
        const tokenID = BigNumber(labelHash).toString(10);
        const homeUrl = `https://etherscan.io/token/${
          addresses.nifty
        }?a=${tokenID}`;
        const imageUrl = `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`;
        const dateRegistered = '?';
        const lockedEther = '?';
        cb(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            name: 'Unknown',
            description: 'The name of this hash is unknown',
            ...rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
            ...openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
          }),
        });
      } else {
        cb(null, {statusCode: 400, body: err.name + ':' + err.message});
      }
    });
};
