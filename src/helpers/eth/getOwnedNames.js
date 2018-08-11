export async function getTokensOwned(beth, owner) {
  const tokens = [];
  const nbTokens = await beth.c.nft.f.balanceOf(owner).call();
  for (const i = 0; i < nbTokens; i++) {
    const tokenId = await beth.c.nft.f.tokenOfOwnerByIndex(owner, i).call();
    tokens.push(tokenId);
  }
  return tokens;
}
