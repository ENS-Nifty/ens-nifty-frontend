import web3 from 'web3';
import ensResolverJson from './abi/ens-resolver.json';

export const ENS_RESOLVER_ADDRESS =
  '0x314159265dD8dbb310642f98f50C066173C1259b';

export const ensResolverContract = new web3.eth.Contract().addContract(
  'resolver',
  ensResolverJson,
  {
    address: ENS_RESOLVER_ADDRESS
  }
);
export async function getResolverAddress(node) {
  return await web3.c.ens.f.resolver(node).call();
}

export async function supportsNameInterface(resolverAddress) {
  return await web3.c.ens.f.supportsInterface('0x691f3431').call();
}
