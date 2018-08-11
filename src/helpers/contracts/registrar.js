import {web3MetamaskSendTransaction, web3Instance} from '../web3';
import registrarJson from './abi/registrar.json';
import resolverJson from './abi/resolver.json';
import addresses from './config/addresses';
import {getResolverAddress, supportsNameInterface} from './ens';

const registrarContract = new web3Instance.eth.Contract(
  registrarJson,
  addresses.registrar,
);
const resolverContract = new web3Instance.eth.Contract(resolverJson);

export async function transferName(labelHash) {
  const address = window.web3.eth.defaultAccount;
  const data = registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .estimateGas({from: address, value: '0'});
  web3MetamaskSendTransaction({
    from: address,
    to: addresses.registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit,
  });
}

export async function nodeToName(node) {
  const resolverAddress = await getResolverAddress(node);
  if (resolverAddress === `0x${'0'.repeat(40)}`) {
    return '';
  }
  if (!(await supportsNameInterface(resolverAddress))) {
    return '';
  }
  return await resolverContract.methods.name(node).call({to: resolverAddress});
}
