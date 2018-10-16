import { web3SendTransaction, web3Instance } from '../web3';
import registrarJson from './abi/registrar.json';
import addresses from './config/addresses';

export async function transferName(labelHash, network, web3) {
  const registrarContract = new web3Instance.eth.Contract(
    registrarJson,
    addresses[network].registrar
  );
  const address = web3.eth.defaultAccount;
  const data = registrarContract.methods
    .transfer(labelHash, addresses[network].nifty)
    .encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await registrarContract.methods
    .transfer(labelHash, addresses[network].nifty)
    .estimateGas({ from: address, value: '0' });
  return web3SendTransaction(web3, {
    from: address,
    to: addresses[network].registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit
  }).then(txHash => web3Instance.eth.getTransactionReceiptMined(txHash));
}

export function labelHashToName(labelHash) {
  return fetch(`/retrieve-label/${labelHash}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
    .then(res => res.text())
    .catch(e => '');
}

export function addLabelToDb(label) {
  fetch(`/add-label`, {
    method: 'POST',
    body: JSON.stringify({label}),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  }).catch(e => {});
}

export function addMetadataToDb(label) {
  fetch(`/add-metadata`, {
    method: 'POST',
    body: JSON.stringify({label}),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  }).catch(e => {});
}
