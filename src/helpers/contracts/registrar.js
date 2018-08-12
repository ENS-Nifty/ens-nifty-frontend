import {web3MetamaskSendTransaction, web3Instance} from '../web3';
import registrarJson from './abi/registrar.json';
import addresses from './config/addresses';

export async function transferName(labelHash, network) {
  const registrarContract = new web3Instance.eth.Contract(
    registrarJson,
    addresses[network].registrar,
  );
  const address = window.web3.eth.defaultAccount;
  const data = registrarContract.methods
    .transfer(labelHash, addresses[network].nifty)
    .encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await registrarContract.methods
    .transfer(labelHash, addresses[network].nifty)
    .estimateGas({from: address, value: '0'});
  return web3MetamaskSendTransaction({
    from: address,
    to: addresses[network].registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit,
  }).then(txHash => web3Instance.eth.getTransactionReceiptMined(txHash));
}

export function labelHashToName(labelHash) {
  return fetch(
    `https://buyethdomains.com/api/reverse-lookup/label-to-name?label=${labelHash}`,
  ).then(res => res.json());
}

export function addNameToLabelHash(name) {
  fetch(`https://buyethdomains.com/api/reverse-lookup/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({name}),
  });
}
