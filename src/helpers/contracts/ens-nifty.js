import web3 from 'web3';
import ensNiftyJson from './abi/ens-nifty.json';

const ENS_NIFTY_ADDRESS = '0x00000000000';

export const ensNiftyContract = new web3.eth.Contract().addContract(
  'nifty',
  ensNiftyJson,
  {
    address: ENS_NIFTY_ADDRESS
  }
);
export async function mintToken(labelHash) {
  return await beth.c.nft.f.mint(labelHash).send();
}

export async function unmintToken(labelHash) {
  return await beth.c.nft.f.burn(labelHash).send();
}

export async function getTokensOwned(owner) {
  const tokens = [];
  console.log('beth', beth);
  const nbTokens = await beth.c.nft.f.balanceOf(owner).call();
  for (let i = 0; i < nbTokens; i++) {
    const tokenId = await beth.c.nft.f.tokenOfOwnerByIndex(owner, i).call();
    tokens.push(tokenId);
  }
  return tokens;
}
