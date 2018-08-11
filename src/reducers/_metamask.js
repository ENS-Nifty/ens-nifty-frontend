import { apiGetMetamaskNetwork } from '../helpers/api';
import { parseError } from '../helpers/utilities';
import {
  accountUpdateAccountAddress,
  accountUpdateNetwork,
  accountUpdateProvider
} from './_account';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const METAMASK_CONNECT_REQUEST = 'metamask/METAMASK_CONNECT_REQUEST';
const METAMASK_CONNECT_SUCCESS = 'metamask/METAMASK_CONNECT_SUCCESS';
const METAMASK_CONNECT_FAILURE = 'metamask/METAMASK_CONNECT_FAILURE';

const METAMASK_NOT_AVAILABLE = 'metamask/METAMASK_NOT_AVAILABLE';

const METAMASK_UPDATE_METAMASK_ACCOUNT =
  'metamask/METAMASK_UPDATE_METAMASK_ACCOUNT';

// -- Actions --------------------------------------------------------------- //

let accountInterval = null;

export const updateAccountAddress = accountAddress => dispatch => {
  if (accountAddress) {
    dispatch(accountUpdateAccountAddress(accountAddress, 'METAMASK'));
    dispatch(accountUpdateProvider(window.web3.currentProvider));
    window.browserHistory.push('/domains');
  }
};

export const metamaskUpdateMetamaskAccount = () => (dispatch, getState) => {
  if (window.web3.eth.defaultAccount !== getState().metamask.accountAddress) {
    const accountAddress = window.web3.eth.defaultAccount;
    dispatch({
      type: METAMASK_UPDATE_METAMASK_ACCOUNT,
      payload: accountAddress
    });
    dispatch(updateAccountAddress(accountAddress));
  }
};

export const metamaskConnectInit = () => (dispatch, getState) => {
  const accountAddress = getState().metamask.accountAddress;
  if (typeof window.web3 !== 'undefined') {
    if (!accountAddress) {
      dispatch(notificationShow('Unlock your Metamask', false));
    }
    dispatch(updateAccountAddress(accountAddress));
    dispatch({ type: METAMASK_CONNECT_REQUEST });
    apiGetMetamaskNetwork()
      .then(network => {
        dispatch({ type: METAMASK_CONNECT_SUCCESS, payload: network });
        dispatch(accountUpdateNetwork(network));
        dispatch(metamaskUpdateMetamaskAccount());
        accountInterval = setInterval(
          () => dispatch(metamaskUpdateMetamaskAccount()),
          100
        );
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: METAMASK_CONNECT_FAILURE });
      });
  } else {
    dispatch(notificationShow('Install Metamask first', false));
    dispatch({ type: METAMASK_NOT_AVAILABLE });
  }
};

export const metamaskClearIntervals = () => dispatch => {
  clearInterval(accountInterval);
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  accountAddress: '',
  web3Available: false,
  network: 'mainnet'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case METAMASK_CONNECT_REQUEST:
      return {
        ...state,
        fetching: true,
        web3Available: false
      };
    case METAMASK_CONNECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        web3Available: true,
        network: action.payload
      };
    case METAMASK_CONNECT_FAILURE:
      return {
        ...state,
        fetching: false,
        web3Available: true
      };
    case METAMASK_NOT_AVAILABLE:
      return {
        ...state,
        fetching: false,
        web3Available: false
      };
    case METAMASK_UPDATE_METAMASK_ACCOUNT:
      return {
        ...state,
        accountAddress: action.payload
      };
    default:
      return state;
  }
};
