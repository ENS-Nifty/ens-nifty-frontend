import { sha3 } from '../helpers/web3';
import { formatENSDomain } from '../helpers/utilities';
import { updateLocal } from '../helpers/localstorage';
import { transferName } from '../helpers/contracts/registrar';
import {
  mintToken,
  getNextTokenizeStep,
  unmintToken
} from '../helpers/contracts/nifty';

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
  const domain = formatENSDomain(name);
  const label = domain.match(/(.*)\.eth/)[1];
  const labelHash = sha3(label);
  updateLocal('domains', [{ domain, labelHash }]);
  const step = await getNextTokenizeStep(labelHash);
  switch (step) {
    case 'transfer':
      dispatch({ type: TRANSFER_NAME_STATUS, payload: 'pending' });
      transferName(labelHash, () => {
        dispatch({
          type: TRANSFER_NAME_STATUS,
          payload: 'success'
        });
        dispatch({ type: MINT_TOKEN_STATUS, payload: 'pending' });
        mintToken(labelHash, () =>
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
      mintToken(labelHash, () =>
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

export const untokenizeUpdateInput = (labelHash = '') => dispatch => {
  const input = '';
  dispatch({ type: UNTTOKENIZE_UPDATE_INPUT, payload: { labelHash, input } });
  window.browserHistory.push('/untokenize-domain');
};

export const untokenizeSubmitTransaction = (
  labelHash = ''
) => async dispatch => {
  dispatch({ type: BURN_TOKEN_STATUS, payload: 'pending' });
  unmintToken(labelHash, () =>
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
