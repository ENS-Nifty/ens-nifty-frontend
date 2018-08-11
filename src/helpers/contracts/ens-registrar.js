import web3 from 'web3';
import ensRegistrarJson from './abi/ens-registrar.json';
import { getResolverAddress, supportsNameInterface } from './ens-resolver';

const ENS_REGISTRAR_ADDRESS = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef';

export const ensRegistrarContract = new web3.eth.Contract().addContract(
  'registrar',
  ensRegistrarJson,
  {
    address: ENS_REGISTRAR_ADDRESS
  }
);

export async function transferName(labelHash) {
  return await beth.c.registrar.f
    .transfer(labelHash, beth.c.nft.options.address)
    .send();
}

export async function nodeToName(node) {
  const resolverAddress = await getResolverAddress(node);
  if (resolverAddress === `0x${'0'.repeat(40)}`) {
    return '';
  }
  if (!(await supportsNameInterface(resolverAddress))) {
    return '';
  }
  return await beth.c.resolver.f.name(node).call();
}
