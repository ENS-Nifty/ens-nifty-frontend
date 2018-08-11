import {web3MetamaskSendTransaction, web3Instance} from '../web3';
import ensJson from './abi/ens.json';
import addresses from './config/addresses';

const ensContract = new web3Instance.eth.Contract(ensJson, addresses.ens);

export async function getResolverAddress(node) {
  return await ensContract.methods.resolver(node).call();
}

export async function supportsNameInterface(resolverAddress) {
  return await ensContract.methods.supportsInterface('0x691f3431').call();
}
