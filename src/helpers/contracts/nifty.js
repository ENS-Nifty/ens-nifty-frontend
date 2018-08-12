import { web3MetamaskSendTransaction, web3Instance } from '../web3';
import niftyJson from './abi/nifty.json';
import registrarJson from './abi/registrar.json';
import deedJson from './abi/deed.json';
import addresses from './config/addresses';
const deedContract = new web3Instance.eth.Contract(deedJson);

export async function mintToken(labelHash, network, cb) {
  if (!addresses[network]) {
    throw new Error('no-network');
  }
  const niftyContract = new web3Instance.eth.Contract(
    niftyJson,
    addresses[network].nifty
  );

  const address = window.web3.eth.defaultAccount;
  const data = niftyContract.methods.mint(labelHash).encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await niftyContract.methods
    .mint(labelHash)
    .estimateGas({ from: address, value: '0' });
  web3MetamaskSendTransaction({
    from: address,
    to: addresses[network].nifty,
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

export async function unmintToken(labelHash, network, cb) {
  const niftyContract = new web3Instance.eth.Contract(
    niftyJson,
    addresses[network].nifty
  );
  const address = window.web3.eth.defaultAccount;
  const data = niftyContract.methods.burn(labelHash).encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await niftyContract.methods
    .burn(labelHash)
    .estimateGas({ from: address, value: '0' });
  web3MetamaskSendTransaction({
    from: address,
    to: addresses[network].nifty,
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

export async function getTokensOwned(owner, network) {
  const niftyContract = new web3Instance.eth.Contract(
    niftyJson,
    addresses[network].nifty
  );
  const tokens = [];

  const nbTokens = await niftyContract.methods.balanceOf(owner).call();
  for (let i = 0; i < nbTokens; i++) {
    const tokenId = await niftyContract.methods
      .tokenOfOwnerByIndex(owner, i)
      .call();
    tokens.push(tokenId);
  }
  return tokens;
}

export async function getNextTokenizeStep(labelHash, network) {
  try {
    const niftyContract = new web3Instance.eth.Contract(
      niftyJson,
      addresses[network].nifty
    );
    const registrarContract = new web3Instance.eth.Contract(
      registrarJson,
      addresses[network].registrar
    );
    const deedAddress = (await registrarContract.methods
      .entries(labelHash)
      .call())[1];
    if (deedAddress === '0x' + '0'.repeat(40)) {
      return 'error-not-registered';
    }
    console.log('deedAddress', deedAddress);
    deedContract.options.address = deedAddress;
    const currentOwner = (await deedContract.methods
      .owner()
      .call()).toLowerCase();
    const tokenExists = await niftyContract.methods.exists(labelHash).call();
    if (
      currentOwner === window.web3.eth.defaultAccount.toLowerCase() &&
      !tokenExists
    ) {
      return 'transfer';
    }
    if (
      currentOwner === addresses[network].nifty.toLowerCase() &&
      !tokenExists
    ) {
      return 'mint';
    }
    if (
      currentOwner === addresses[network].nifty.toLowerCase() &&
      tokenExists
    ) {
      return 'done';
    }
    return 'error-not-owned';
  } catch (error) {
    return error.message;
  }
}
