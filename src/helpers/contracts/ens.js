import {web3Instance} from '../web3';
import ensJson from './abi/ens.json';
import addresses from './config/addresses';


export async function getResolverAddress(node, network) {
  if (!addresses[network]) throw new Error('no-network')
  const ensContract = new web3Instance.eth.Contract(ensJson, addresses[network].ens);
  return await ensContract.methods.resolver(node).call();
}

export async function supportsNameInterface(resolverAddress, network) {
  if (!addresses[network]) throw new Error('no-network')
  const ensContract = new web3Instance.eth.Contract(ensJson, addresses[network].ens);
  return await ensContract.methods.supportsInterface('0x691f3431').call();
}
