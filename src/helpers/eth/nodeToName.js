export async function getResolverAddress(beth, node) {
  return await beth.c.ens.f.resolver(node).call();
}

export async function supportsNameInterface(beth, resolverAddress) {
  const supportsName = await beth.c.ens.f
    .supportsInterface('0x691f3431')
    .call();
  return supportsName;
}

export async function nodeToName(beth, node) {
  const resolverAddress = await getResolverAddress(beth, node);
  if (resolverAddress === `0x${'0'.repeat(40)}`) {
    return '';
  }
  if (!(await supportsNameInterface(beth, resolverAddress))) {
    return '';
  }
  return await beth.c.resolver.f.name(node).call();
}
