import beth from './beth';

export async function transferName(labelHash) {
  return await beth.c.registrar.f
    .transfer(labelHash, beth.c.nft.options.address)
    .send();
}

export async function mintToken(labelHash) {
  return await beth.c.nft.f.mint(labelHash).send();
}

export async function unmintToken(labelHash) {
  return await beth.c.nft.f.burn(labelHash).send();
}
