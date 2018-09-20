import Web3 from 'web3';

export function namehash(name) {
  const labels = name.split('.');
  if (labels[labels.length - 1] === '') {
    labels.pop();
  }
  if (labels[0] === '') {
    labels.shift();
  }

  return labels
    .reverse()
    .reduce(
      (a, v) =>
        Web3.utils.keccak256(
          Buffer.from(
            a.replace('0x', '') + Web3.utils.keccak256(v).replace('0x', ''),
            'hex',
          ),
        ),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
}

export function subnodeHash(...labels) {
  return labels.reduce((a, v) =>
    Web3.utils.keccak256(
      Buffer.from(a.replace('0x', '') + v.replace('0x', ''), 'hex'),
    ),
  );
}

export function nodeFromLabelHash(labelHash) {
  return subnodeHash(namehash('.eth'), labelHash);
}
