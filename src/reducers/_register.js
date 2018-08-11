import Web3 from 'web3';
import {transferName} from '../helpers/contracts/registrar';
import {mintToken} from '../helpers/contracts/nifty';
// -- Constants ------------------------------------------------------------- //
const REGISTER_UPDATE_INPUT = 'notification/REGISTER_UPDATE_INPUT';

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
  // return await transferName(Web3.utils.keccak256(label));
  return await mintToken(Web3.utils.keccak256(label));
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  input: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_UPDATE_INPUT:
      return {
        ...state,
        input: action.payload,
      };
    default:
      return state;
  }
};
