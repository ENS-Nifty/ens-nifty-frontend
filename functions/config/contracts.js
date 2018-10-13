import ethers from 'ethers';
import addresses from './addresses';
import ensJson from '../abi/ens';
import registrarJson from '../abi/registrar';
import niftyJson from '../abi/nifty';
const providers = require('ethers').providers;

const network = providers.networks.mainnet;
const provider = new ethers.providers.InfuraProvider(network);

const ensContract = new ethers.Contract(addresses.ens, ensJson, provider);
const registrarContract = new ethers.Contract(
  addresses.registrar,
  registrarJson,
  provider,
);
const niftyContract = new ethers.Contract(addresses.nifty, niftyJson, provider);

export {niftyContract, ensContract, registrarContract};
