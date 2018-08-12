import {sha3} from '../helpers/web3';
import {formatENSDomain} from '../helpers/utilities';
import {updateLocal} from '../helpers/localstorage';
import {isValidAddress} from '../helpers/validators';
import {transferName, addNameToLabelHash} from '../helpers/contracts/registrar';
import {
  mintToken,
  getNextTokenizeStep,
  unmintToken,
  transferToken,
} from '../helpers/contracts/nifty';
import {notificationShow} from './_notification';
import {resolveNameOrAddr} from '../helpers/contracts/ens';
import addresses from '../helpers/contracts/config/addresses';
import Web3 from 'web3';
// -- Constants ------------------------------------------------------------- //
const TOKENIZE_UPDATE_DOMAIN = 'tokenize/TOKENIZE_UPDATE_DOMAIN';

const UNTTOKENIZE_UPDATE_DOMAIN = 'tokenize/UNTTOKENIZE_UPDATE_DOMAIN';

const TRANSFER_UPDATE_DOMAIN = 'tokenize/TRANSFER_UPDATE_DOMAIN';

const TRANSFER_UPDATE_RECIPIENT = 'tokenize/TRANSFER_UPDATE_RECIPIENT';

const MINT_TOKEN_STATUS = 'tokenize/MINT_TOKEN_STATUS';

const TRANSFER_NAME_STATUS = 'tokenize/TRANSFER_NAME_STATUS';

const BURN_TOKEN_STATUS = 'tokenize/BURN_TOKEN_STATUS';

const TRANSFER_TOKEN_STATUS = 'tokenize/TRANSFER_TOKEN_STATUS';

const TOKENIZE_CLEAR_STATE = 'tokenize/TOKENIZE_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
export const tokenizeUpdateDomain = (domain = '') => ({
  type: TOKENIZE_UPDATE_DOMAIN,
  payload: domain,
});

export const tokenizeSubmitTransaction = name => async (dispatch, getState) => {
  const network = getState().account.network;
  if (!addresses[network]) {
    dispatch(notificationShow('Please switch to Mainnet or Ropsten', true));
    return;
  }
  if (!name.trim()) return;
  let hasEth =
    name
      .split('.')
      .pop()
      .toLowerCase() === 'eth';
  if (!hasEth) {
    dispatch(
      notificationShow("Sorry, only available for names ending in 'eth'", true),
    );
    return;
  }
  const domain = formatENSDomain(name);
  const label = domain.match(/(.*)\.eth/)[1];
  const labelHash = sha3(label);
  updateLocal('domains', [{domain, label, labelHash}]);
  await addNameToLabelHash(label);
  const step = await getNextTokenizeStep(labelHash, network);
  switch (step) {
    case 'transfer':
      dispatch({type: TRANSFER_NAME_STATUS, payload: 'pending'});
      transferName(labelHash, network)
        .then(() => {
          dispatch({
            type: TRANSFER_NAME_STATUS,
            payload: 'success',
          });
          dispatch({type: MINT_TOKEN_STATUS, payload: 'pending'});
          mintToken(labelHash, network)
            .then(() =>
              dispatch({
                type: MINT_TOKEN_STATUS,
                payload: 'success',
              }),
            )
            .catch(() =>
              dispatch({
                type: MINT_TOKEN_STATUS,
                payload: '',
              }),
            );
        })
        .catch(() =>
          dispatch({
            type: TRANSFER_NAME_STATUS,
            payload: '',
          }),
        );
      break;
    case 'mint':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success',
      });
      dispatch({type: MINT_TOKEN_STATUS, payload: 'pending'});
      mintToken(labelHash, network)
        .then(() =>
          dispatch({
            type: MINT_TOKEN_STATUS,
            payload: 'success',
          }),
        )
        .catch(() => dispatch({type: MINT_TOKEN_STATUS, payload: ''}));
      break;
    case 'done':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success',
      });
      dispatch({type: MINT_TOKEN_STATUS, payload: 'success'});
      break;
    case 'error-not-owned':
      dispatch(notificationShow("Looks like you don't own that domain.", true));
      break;
    case 'error-not-registered':
      dispatch(notificationShow('Looks like no one owns that domain.', true));
      break;
    case 'error':
      dispatch(notificationShow("Sorry, something's gone wrong", true));
      break;
    default:
      dispatch(notificationShow("Sorry, something's gone wrong", true));
      console.error(step);
      break;
  }
};

export const untokenizeUpdateDomain = (
  domain = '',
  labelHash = '',
) => dispatch => {
  dispatch({type: UNTTOKENIZE_UPDATE_DOMAIN, payload: {labelHash, domain}});
  window.browserHistory.push('/untokenize-domain');
};

export const untokenizeSubmitTransaction = (labelHashOrDomain = '') => async (
  dispatch,
  getState,
) => {
  const network = getState().account.network;
  const labelHash = labelHashOrDomain.startsWith('0x')
    ? labelHashOrDomain
    : Web3.utils.keccak256(labelHashOrDomain.replace('.eth', ''));
  dispatch({type: BURN_TOKEN_STATUS, payload: 'pending'});
  unmintToken(labelHash, network)
    .then(() => dispatch({type: BURN_TOKEN_STATUS, payload: 'success'}))
    .catch(() => dispatch({type: BURN_TOKEN_STATUS, payload: ''}));
};

export const transferUpdateDomain = (
  domain = '',
  labelHash = '',
) => dispatch => {
  dispatch({type: TRANSFER_UPDATE_DOMAIN, payload: {labelHash, domain}});
  window.browserHistory.push('/transfer-domain');
};

export const transferUpdateRecipient = (recipient = '') => ({
  type: TRANSFER_UPDATE_RECIPIENT,
  payload: recipient,
});

export const transferSubmitTransaction = (
  labelHashOrDomain = '',
) => async (dispatch, getState) => {
  if (labelHashOrDomain.startsWith('0x') && !isValidAddress(labelHashOrDomain)) {
    dispatch(notificationShow(`Address is invalid`, true));
    return;
  }
  const network = getState().account.network;
  const labelHash = labelHashOrDomain.startsWith('0x')
    ? labelHashOrDomain
    : Web3.utils.keccak256(labelHashOrDomain.replace('.eth', ''));
  const recipient = await resolveNameOrAddr(labelHashOrDomain, network);
  if (!recipient) {
    dispatch(notificationShow(`Couldn't resolve ENS domain`, true));
    return;
  }
  dispatch({type: TRANSFER_TOKEN_STATUS, payload: 'pending'});
  transferToken(labelHash, recipient, network)
    .then(() => dispatch({type: TRANSFER_TOKEN_STATUS, payload: 'success'}))
    .catch(() => dispatch({type: TRANSFER_TOKEN_STATUS, payload: ''}));
};

export const tokenizeClearState = (recipient = '') => ({
  type: TOKENIZE_CLEAR_STATE
});

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  labelHash: '',
  domain: '',
  recipient: '',
  transferNameStatus: '',
  mintTokenStatus: '',
  burnTokenStatus: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKENIZE_UPDATE_DOMAIN:
      return {
        ...state,
        domain: action.payload,
      };
    case UNTTOKENIZE_UPDATE_DOMAIN:
      return {
        ...state,
        labelHash: action.payload.labelHash,
        domain: action.payload.domain,
      };
    case TRANSFER_UPDATE_DOMAIN:
      return {
        ...state,
        labelHash: action.payload.labelHash,
        domain: action.payload.domain,
      };
    case TRANSFER_UPDATE_RECIPIENT:
      return {
        ...state,
        recipient: action.payload,
      };
    case TRANSFER_NAME_STATUS:
      return {
        ...state,
        transferNameStatus: action.payload,
      };
    case MINT_TOKEN_STATUS:
      return {
        ...state,
        mintTokenStatus: action.payload,
      };
    case BURN_TOKEN_STATUS:
      return {
        ...state,
        burnTokenStatus: action.payload,
      };
    case TOKENIZE_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
