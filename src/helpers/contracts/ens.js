import { web3Instance, namehash } from '../web3';
import ensJson from './abi/ens.json';
import addresses from './config/addresses';
import resolverJson from './abi/resolver.json';

export async function getResolverAddress(node, network) {
  if (!addresses[network]) throw new Error('no-network');
  const ensContract = new web3Instance.eth.Contract(
    ensJson,
    addresses[network].ens
  );
  return await ensContract.methods.resolver(node).call();
}

export async function getResolveToAddress(node, network) {
  const resolverAddress = await getResolverAddress(node, network);
  if (!resolverAddress) {
    return '';
  }
  const resolverContract = new web3Instance.eth.Contract(
    resolverJson,
    resolverAddress
  );
  const resolveToAddress = await resolverContract.methods.addr(node).call();
  return resolveToAddress;
}

export async function resolveNameOrAddr(nameOrAddr, network) {
  if (nameOrAddr.endsWith('.eth')) {
    return await getResolverAddress(namehash(nameOrAddr), network);
  }
  return nameOrAddr;
}

export async function supportsNameInterface(resolverAddress, network) {
  if (!addresses[network]) throw new Error('no-network');
  const ensContract = new web3Instance.eth.Contract(
    ensJson,
    addresses[network].ens
  );
  return await ensContract.methods.supportsInterface('0x691f3431').call();
}
