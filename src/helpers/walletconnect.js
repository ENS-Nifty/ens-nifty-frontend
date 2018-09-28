import Web3 from "web3";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import WalletConnectSubprovider from "walletconnect-web3-subprovider";
import WalletConnectQRCodeModal from 'walletconnect-qrcode-modal'

let web3 = null

export async function getWalletConnectWeb3(network = 'mainnet') {
  const engine = new ProviderEngine();

  engine.addProvider(
    new WalletConnectSubprovider({
      bridgeUrl: "https://test-bridge.walletconnect.org",
      dappName: "INSERT_DAPP_NAME"
    })
  );
  engine.addProvider(new RpcSubprovider({ rpcUrl: `https://${network}.infura.io/` }));
  engine.start();

  web3 = new Web3(engine);
  await web3.initSession()
  return web3;
}

export function getWalletConnectAccounts() {
  const accounts = web3.webConnector.accounts
  return accounts
}

export function getWalletConnectUri() {
  const uri = web3.webConnector.uri
  return uri
}

export function openWalletConnectModal(uri) {
  WalletConnectQRCodeModal.open(uri)
}

export function closeWalletConnectModal() {
  WalletConnectQRCodeModal.close()
}

export async function listenWalletConnectSessionStatus() {
  const sessionStatus = await web3.webConnector.listenSessionStatus()
  return sessionStatus
}

export async function createWalletConnectSession() {
  const uri = getWalletConnectUri()
  WalletConnectQRCodeModal.open(uri)
  await listenWalletConnectSessionStatus
  WalletConnectQRCodeModal.close()
  const accounts = getWalletConnectAccounts()
  return accounts
}
