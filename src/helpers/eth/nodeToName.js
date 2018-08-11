import beth from './beth';

export async function getResolverAddress(node) {
  return await beth.c.ens.f.resolver(node).call();
}

export async function supportsNameInterface(resolverAddress) {
  return await beth.c.ens.f.supportsInterface('0x691f3431').call();
}

export async function nodeToName(node) {
  const resolverAddress = await getResolverAddress(node);
  if (resolverAddress === `0x${'0'.repeat(40)}`) {
    return '';
  }
  if (!(await supportsNameInterface(resolverAddress))) {
    return '';
  }
  return await beth.c.resolver.f.name(node).call();
}
