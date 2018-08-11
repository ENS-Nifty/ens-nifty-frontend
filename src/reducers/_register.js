import Web3 from 'web3';
import {transferName} from '../helpers/contracts/registrar';
import {mintToken, getNextRegisterStep} from '../helpers/contracts/nifty';
// -- Constants ------------------------------------------------------------- //
const REGISTER_UPDATE_INPUT = 'notification/REGISTER_UPDATE_INPUT';
const MINT_TOKEN_STATUS = 'notification/MINT_TOKEN_STATUS';
const TRANSFER_NAME_STATUS = 'notification/TRANSFER_NAME_STATUS';

// -- Actions --------------------------------------------------------------- //
export const registerUpdateInput = (input = '') => dispatch => {
  dispatch({type: REGISTER_UPDATE_INPUT, payload: input});
};

function formatDomain(name) {
  if (name.endsWith('.eth')) {
    return name;
  } else return name + '.eth';
}

export const registerSubmitTransaction = name => async dispatch => {
  const label = formatDomain(name).match(/(.*)\.eth/)[1];
  const step = await getNextRegisterStep(Web3.utils.keccak256(label));
  switch (step) {
    case 'transfer':
      dispatch({type: TRANSFER_NAME_STATUS, payload: 'pending'});
      transferName(Web3.utils.keccak256(label), () => {
        dispatch({
          type: TRANSFER_NAME_STATUS,
          payload: 'success',
        });
        dispatch({type: MINT_TOKEN_STATUS, payload: 'pending'});
        mintToken(Web3.utils.keccak256(label), () =>
          dispatch({
            type: MINT_TOKEN_STATUS,
            payload: 'success',
          }),
        );
      });
      break;
    case 'mint':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success',
      });
      dispatch({type: MINT_TOKEN_STATUS, payload: 'pending'});
      mintToken(Web3.utils.keccak256(label), () =>
        dispatch({
          type: MINT_TOKEN_STATUS,
          payload: 'success',
        }),
      );
      break;
    case 'done':
      dispatch({
        type: TRANSFER_NAME_STATUS,
        payload: 'success',
      });
      dispatch({type: MINT_TOKEN_STATUS, payload: 'success'});
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
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_UPDATE_INPUT:
      return {
        ...state,
        input: action.payload,
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
    default:
      return state;
  }
};
