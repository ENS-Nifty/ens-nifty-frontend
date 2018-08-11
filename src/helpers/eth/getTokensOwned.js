import beth from './beth';

export async function getTokensOwned(owner) {
  const tokens = [];
  const nbTokens = await beth.c.nft.f.balanceOf(owner).call();
  for (let i = 0; i < nbTokens; i++) {
    const tokenId = await beth.c.nft.f.tokenOfOwnerByIndex(owner, i).call();
    tokens.push(tokenId);
  }
  return tokens;
}
