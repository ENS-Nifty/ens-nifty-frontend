import Web3 from 'web3';
import addresses from './addresses';
import ensJson from '../abi/ens';
import registrarJson from '../abi/registrar';
import deedJson from '../abi/deed';
import niftyJson from '../abi/nifty';

const web3 = new Web3(`https://mainnet.infura.io/mew`);

const ensContract = new web3.eth.Contract(ensJson, addresses.ens);
const registrarContract = new web3.eth.Contract(
  registrarJson,
  addresses.registrar,
);
const niftyContract = new web3.eth.Contract(niftyJson, addresses.nifty);
const deedContract = new web3.eth.Contract(deedJson);

export {niftyContract, ensContract, registrarContract, deedContract};
