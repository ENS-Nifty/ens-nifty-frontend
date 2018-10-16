import {utils as ethUtils} from 'ethers';

exports.handler = (event, context, cb) => {
  if (!event.queryStringParameters || !event.queryStringParameters.label) {
    return cb(null, {
      statusCode: 500,
      body: 'Label not provided',
    });
  }
  const label = event.queryStringParameters.label;
  const hash = ethUtils.id(label);
  cb(null, {statusCode: 200, body: hash})
};
