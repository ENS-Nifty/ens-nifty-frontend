import Web3 from 'web3';
import { formatENSDomain } from '../helpers/utilities';
import { transferName } from '../helpers/contracts/registrar';
import { mintToken, getNextRegisterStep } from '../helpers/contracts/nifty';
// -- Constants ------------------------------------------------------------- //
const TOKENIZE_UPDATE_INPUT = 'tokenize/TOKENIZE_UPDATE_INPUT';

const MINT_TOKEN_STATUS = 'tokenize/MINT_TOKEN_STATUS';

const TRANSFER_NAME_STATUS = 'tokenize/TRANSFER_NAME_STATUS';

const BURN_TOKEN_STATUS = 'tokenize/BURN_TOKEN_STATUS';

// -- Actions --------------------------------------------------------------- //
export const tokenizeUpdateInput = (input = '') => dispatch => {
  dispatch({ type: TOKENIZE_UPDATE_INPUT, payload: input });
};

export const tokenizeSubmitTransaction = name => async dispatch => {
  const label = formatENSDomain(name).match(/(.*)\.eth/)[1];
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
    default:
      break;
  }
};

export const untokenizeSubmitTransaction = name => async dispatch => {
  const label = formatENSDomain(name).match(/(.*)\.eth/)[1];
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
    default:
      break;
  }
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
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
        mintTokenStatus: action.payload
      };
    default:
      return state;
  }
};
