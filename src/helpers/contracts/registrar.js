import {
  web3MetamaskSendTransaction,
  web3Instance,
  subnodeHash,
  namehash
} from '../web3';
import Web3 from 'web3';
import registrarJson from './abi/registrar.json';
import resolverJson from './abi/resolver.json';
import addresses from './config/addresses';
import { getResolverAddress, supportsNameInterface } from './ens';
import ethensnamehash from 'eth-ens-namehash';

const registrarContract = new web3Instance.eth.Contract(
  registrarJson,
  addresses.registrar
);
const resolverContract = new web3Instance.eth.Contract(resolverJson);

export async function transferName(labelHash, cb) {
  const address = window.web3.eth.defaultAccount;
  const data = registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .estimateGas({ from: address, value: '0' });
  web3MetamaskSendTransaction({
    from: address,
    to: addresses.registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit
  })
    .then(txHash => {
      return web3Instance.eth.getTransactionReceiptMined(txHash);
    })
    .then(cb);
}

export async function nodeToName(node) {
  console.log('ethensnamehash', ethensnamehash.hash('pedrouid.eth'));
  console.log('pedrouid');
  console.log('hash', web3Instance.utils.sha3('pedrouid'));
  console.log('node 10', node);
  let nodeHash = '0x0000000000000000000000000000000000000000';
  if (!node.startsWith('0x')) {
    nodeHash = web3Instance.utils.toHex(node);
  }
  console.log('node 16', nodeHash);
  const ethHash = web3Instance.utils.sha3('eth');
  const labelHash = web3Instance.utils.soliditySha3(
    '0x0000000000000000000000000000000000000000',
    ethHash
  );
  console.log('ethHash', ethHash);
  const nameHash = web3Instance.utils.soliditySha3(nodeHash, labelHash);
  console.log('nameHash', nameHash);
  const resolverAddress = await getResolverAddress(nameHash);
  console.log('resolverAddress', resolverAddress);
  console.log(
    'GOAL ===> 0xf67f870c5a198b27aace8c241be62e2b239b82a46f80e655fb484d1e5a9d0edd'
  );
  if (resolverAddress === `0x${'0'.repeat(40)}`) {
    return '';
  }
  if (!(await supportsNameInterface(resolverAddress))) {
    return '';
  }
  return await resolverContract.methods
    .name(node)
    .call({ to: resolverAddress });
}
