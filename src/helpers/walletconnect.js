import Web3 from 'web3';
import WalletConnectProvider from 'walletconnect-web3-provider';
import WalletConnectQRCodeModal from 'walletconnect-qrcode-modal';

let web3WalletConnect = null;

export async function walletConnectGetWeb3(network = 'mainnet') {
  const provider = new WalletConnectProvider({
    bridgeUrl: 'https://test-bridge.walletconnect.org',
    dappName: 'ENS Nifty',
    rpcUrl: `https://${network}.infura.io/`
  });

  web3WalletConnect = new Web3(provider);

  await web3WalletConnect.currentProvider.walletconnect.initSession();

  return web3WalletConnect;
}

export async function walletConnectGetAccounts() {
  const accounts = await web3WalletConnect.eth.getAccounts();
  return accounts;
}

export function walletConnectGetUri() {
  const uri = web3WalletConnect.currentProvider.walletconnect.uri;
  return uri;
}

export function walletConnectOpenModal(uri, cb) {
  WalletConnectQRCodeModal.open(uri, cb);
}

export function walletConnectCloseModal() {
  WalletConnectQRCodeModal.close();
}

export async function walletConnectListenSessionStatus() {
  const sessionStatus = await web3WalletConnect.currentProvider.walletconnect.listenSessionStatus();
  return sessionStatus;
}

export function walletConnectStopLastListener() {
  web3WalletConnect.currentProvider.walletconnect.stopLastListener();
}

export async function walletConnectCreateSession() {
  const uri = walletConnectGetUri();
  await walletConnectOpenModal(uri, walletConnectStopLastListener);
  await walletConnectListenSessionStatus();
  await walletConnectCloseModal();
  const accounts = walletConnectGetAccounts();
  return accounts;
}
