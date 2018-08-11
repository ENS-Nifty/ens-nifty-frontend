import Browseth from 'browseth';
import addresses from './config/addresses';
import ensJson from './contracts/build/ens';
import registrarJson from './contracts/build/registrar';

const ETHEREUM_RPC_URL = 'https://mainnet.infura.io/mew';

const fallbackRpc = new Browseth.Rpcs.Default(
  Browseth.transport,
  ETHEREUM_RPC_URL,
);

const beth = new Browseth(fallbackRpc)
  .addContract('ens', ensJson, {
    address: addresses.ens,
  })
  .addContract('registrar', registrarJson, {
    address: addresses.registrar,
  });

beth.wallet = new Browseth.Wallets.Offline(
  beth.rpc,
  new Browseth.Signers.PrivateKey(
    '1234567890123456789012345678901234567890123456789012345678901234',
  ),
);

function bethConnectWeb3(provider) {
  beth.wallet = new Browseth.Wallets.Online(new Browseth.Rpcs.Web3(provider));
}

export {beth as default, beth, fallbackRpc, bethConnectWeb3};
