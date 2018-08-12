import { apiGetTransaction } from '../helpers/api';
import { parseError, getLocalDomainFromLabelHash } from '../helpers/utilities';
import { web3SetHttpProvider, web3Instance } from '../helpers/web3';
import { notificationShow } from './_notification';
import { labelHashToName } from '../helpers/contracts/registrar';
import { getTokensOwned } from '../helpers/contracts/nifty';

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST';
const ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS';
const ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE';

const ACCOUNT_GET_TOKENIZED_DOMAINS_REQUEST =
  'account/ACCOUNT_GET_TOKENIZED_DOMAINS_REQUEST';
const ACCOUNT_GET_TOKENIZED_DOMAINS_SUCCESS =
  'account/ACCOUNT_GET_TOKENIZED_DOMAINS_SUCCESS';
const ACCOUNT_GET_TOKENIZED_DOMAINS_FAILURE =
  'account/ACCOUNT_GET_TOKENIZED_DOMAINS_FAILURE';

const ACCOUNT_UPDATE_ACCOUNT_ADDRESS = 'account/ACCOUNT_UPDATE_ACCOUNT_ADDRESS';

const ACCOUNT_UPDATE_NETWORK = 'account/ACCOUNT_UPDATE_NETWORK';

const ACCOUNT_UPDATE_PROVIDER = 'account/ACCOUNT_UPDATE_PROVIDER';

const ACCOUNT_CLEAR_STATE = 'account/ACCOUNT_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //

export const accountCheckTransactionStatus = (txHash, network) => (
  dispatch,
  getState
) => {
  dispatch({ type: ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST });
  const network = getState().account.network;

  apiGetTransaction(txHash, network)
    .then(response => {
      const data = response.data;
      if (
        data &&
        !data.error &&
        (data.input === '0x' ||
          (data.input !== '0x' && data.operations && data.operations.length))
      ) {
        dispatch({
          type: ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS
        });
      } else {
        setTimeout(
          () => dispatch(accountCheckTransactionStatus(txHash, network)),
          1000
        );
      }
    })
    .catch(error => {
      setTimeout(
        () => dispatch(accountCheckTransactionStatus(txHash, network)),
        1000
      );
      dispatch({ type: ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE });
      const message = parseError(error);
      dispatch(notificationShow(message, true));
    });
};

export const accountUpdateNetwork = network => dispatch => {
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: ACCOUNT_UPDATE_NETWORK, payload: network });
};

export const accountUpdateAccountAddress = (address, type) => (
  dispatch,
  getState
) => {
  if (!address || !type) return;
  if (getState().account.type !== type) dispatch(accountClearState());
  dispatch({
    type: ACCOUNT_UPDATE_ACCOUNT_ADDRESS,
    payload: { address, type }
  });
};

export const accountClearState = () => dispatch => {
  dispatch({ type: ACCOUNT_CLEAR_STATE });
};

export const accountGetTokenizedDomains = () => (dispatch, getState) => {
  const network = getState().account.network;
  dispatch({ type: ACCOUNT_GET_TOKENIZED_DOMAINS_REQUEST });
  getTokensOwned(getState().account.address, network)
    .then(async tokens => {
      if (tokens.length) {
        tokens = tokens.map(token => ({
          domain: '',
          labelHash: web3Instance.utils.toHex(token)
        }));
        tokens = await Promise.all(
          tokens.map(async token => {
            token.domain = getLocalDomainFromLabelHash(token.labelHash);
            if (!token.domain) {
              const name = await labelHashToName(token.labelHash);
              if (name) {
                token.domain = `${name}.eth`;
              }
              return token;
            }
            return token;
          })
        );
      }
      dispatch({
        type: ACCOUNT_GET_TOKENIZED_DOMAINS_SUCCESS,
        payload: tokens
      });
    })
    .catch(error => {
      dispatch({ type: ACCOUNT_GET_TOKENIZED_DOMAINS_FAILURE });
      const message = parseError(error);
      dispatch(notificationShow(message, true));
    });
};

export // -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  network: 'mainnet',
  provider: null,
  type: '',
  address: '',
  domains: [],
  tokens: [],
  fetching: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_GET_TOKENIZED_DOMAINS_REQUEST:
      return { ...state, fetching: true };
    case ACCOUNT_GET_TOKENIZED_DOMAINS_SUCCESS:
      return { ...state, fetching: false, domains: action.payload };
    case ACCOUNT_GET_TOKENIZED_DOMAINS_FAILURE:
      return { ...state, fetching: false };
    case ACCOUNT_UPDATE_ACCOUNT_ADDRESS:
      return {
        ...state,
        type: action.payload.type,
        address: action.payload.address,
        transactions: []
      };
    case ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS:
      return {
        ...state,
        transactions: action.payload
      };
    case ACCOUNT_UPDATE_NETWORK:
      return {
        ...state,
        network: action.payload
      };
    case ACCOUNT_UPDATE_PROVIDER:
      return {
        ...state,
        provider: action.payload
      };
    case ACCOUNT_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
