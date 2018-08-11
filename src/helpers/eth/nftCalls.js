export async function transferName(beth, labelHash) {
  return await beth.c.registrar.f
    .transfer(labelHash, beth.c.nft.options.address)
    .send();
}

export async function mintToken(beth, labelHash) {
  return await beth.c.nft.f.mint(labelHash).send();
}

export async function unmintToken(beth, labelHash) {
  return await beth.c.nft.f.burn(labelHash).send();
}
