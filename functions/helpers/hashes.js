import {utils as ethUtils} from 'ethers';

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
        ethUtils.id(
          Buffer.from(
            a.replace('0x', '') + ethUtils.id(v).replace('0x', ''),
            'hex',
          ),
        ),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
}

export function subnodeHash(...labels) {
  return labels.reduce((a, v) =>
    ethUtils.id(
      Buffer.from(a.replace('0x', '') + v.replace('0x', ''), 'hex'),
    ),
  );
}

export function nodeFromLabelHash(labelHash) {
  return subnodeHash(namehash('.eth'), labelHash);
}
