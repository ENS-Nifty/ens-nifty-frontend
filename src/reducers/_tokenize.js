import Web3 from 'web3';
import { transferName } from '../helpers/contracts/registrar';
import { mintToken, getNextRegisterStep } from '../helpers/contracts/nifty';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const TOKENIZE_UPDATE_INPUT = 'tokenize/TOKENIZE_UPDATE_INPUT';
const MINT_TOKEN_STATUS = 'tokenize/MINT_TOKEN_STATUS';
const TRANSFER_NAME_STATUS = 'tokenize/TRANSFER_NAME_STATUS';

// -- Actions --------------------------------------------------------------- //
export const tokenizeUpdateInput = (input = '') => dispatch => {
  dispatch({ type: TOKENIZE_UPDATE_INPUT, payload: input });
};

function formatDomain(name) {
  if (name.endsWith('.eth')) {
    return name;
  } else return name + '.eth';
}

export const tokenizeSubmitTransaction = name => async dispatch => {
  let hasEth = name.split('.').pop().toLowerCase() === 'eth'
  if (!hasEth) {
    dispatch(notificationShow("Sorry, only available for names ending in 'eth'", true));
    return
  }
  const label = formatDomain(name).match(/(.*)\.eth/)[1];
  const step = await getNextRegisterStep(Web3.utils.keccak256(label));
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

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  input: '',
  transferNameStatus: '',
  mintTokenStatus: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKENIZE_UPDATE_INPUT:
      return {
        ...state,
        input: action.payload
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
    default:
      return state;
  }
};
