import Web3 from 'web3';
import { formatENSDomain } from '../helpers/utilities';
import { transferName } from '../helpers/contracts/registrar';
import { mintToken, getNextTokenizeStep, unmintToken } from '../helpers/contracts/nifty';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const TOKENIZE_UPDATE_INPUT = 'tokenize/TOKENIZE_UPDATE_INPUT';

const UNTTOKENIZE_UPDATE_INPUT = 'tokenize/UNTTOKENIZE_UPDATE_INPUT';

const MINT_TOKEN_STATUS = 'tokenize/MINT_TOKEN_STATUS';

const TRANSFER_NAME_STATUS = 'tokenize/TRANSFER_NAME_STATUS';

const BURN_TOKEN_STATUS = 'tokenize/BURN_TOKEN_STATUS';

// -- Actions --------------------------------------------------------------- //
export const tokenizeUpdateInput = (input = '') => dispatch => {
  dispatch({ type: TOKENIZE_UPDATE_INPUT, payload: input });
};

export const tokenizeSubmitTransaction = name => async dispatch => {
  if (!name.trim()) return
  let hasEth = name.split('.').pop().toLowerCase() === 'eth'
  if (!hasEth) {
    dispatch(notificationShow("Sorry, only available for names ending in 'eth'", true));
    return
  }
  const label = formatENSDomain(name).match(/(.*)\.eth/)[1];
  const step = await getNextTokenizeStep(Web3.utils.keccak256(label));
  switch (step) {
    case 'transfer':
      dispatch({ type: TRANSFER_NAME_STATUS, payload: 'pending' });
      transferName(Web3.utils.keccak256(label), () => {
        dispatch({
          type: TRANSFER_NAME_STATUS,
          payload: 'success'
        });
        dispatch({ type: MINT_TOKEN_STATUS, payload: 'pending' });
        mintToken(Web3.utils.keccak256(label), () =>
          dispatch({
            type: MINT_TOKEN_STATUS,
            payload: 'success'
          })
        );
      });
      break;
    case 'mint':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success'
      });
      dispatch({ type: MINT_TOKEN_STATUS, payload: 'pending' });
      mintToken(Web3.utils.keccak256(label), () =>
        dispatch({
          type: MINT_TOKEN_STATUS,
          payload: 'success'
        })
      );
      break;
    case 'done':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success'
      });
      dispatch({ type: MINT_TOKEN_STATUS, payload: 'success' });
      break;
    case 'error-not-owned':
      dispatch(notificationShow("Looks like you don't own that domain.", true));
      break;
    case 'error-not-registered':
      dispatch(notificationShow("Looks like no one owns that domain.", true));
      break;
    case 'error':
      dispatch(notificationShow("Sorry, something's gone wrong", true));
      break;
    default:
        dispatch(notificationShow("Sorry, something's gone wrong", true));
        console.error(step)
        break
  }
};

export const untokenizeUpdateInput = (labelHash = '') => dispatch => {
  const input = '';
  dispatch({ type: UNTTOKENIZE_UPDATE_INPUT, payload: { labelHash, input } });
  window.browserHistory.push('/untokenize-domain');
};

export const untokenizeSubmitTransaction = (
  labelHash = ''
) => async dispatch => {
  dispatch({ type: BURN_TOKEN_STATUS, payload: 'pending' });
  unmintToken(Web3.utils.keccak256(labelHash), () =>
    dispatch({
      type: BURN_TOKEN_STATUS,
      payload: 'success'
    })
  );
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  labelHash: '',
  input: '',
  transferNameStatus: '',
  mintTokenStatus: '',
  burnTokenStatus: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKENIZE_UPDATE_INPUT:
      return {
        ...state,
        input: action.payload
      };
    case UNTTOKENIZE_UPDATE_INPUT:
      return {
        ...state,
        labelHash: action.payload.labelHash,
        input: action.payload.input
      };
    case TRANSFER_NAME_STATUS:
      return {
        ...state,
        transferNameStatus: action.payload
      };
    case MINT_TOKEN_STATUS:
      return {
        ...state,
        mintTokenStatus: action.payload
      };
    case BURN_TOKEN_STATUS:
      return {
        ...state,
        burnTokenStatus: action.payload
      };
    default:
      return state;
  }
};
