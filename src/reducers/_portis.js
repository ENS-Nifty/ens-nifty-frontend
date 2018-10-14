import { apiGetPortisNetwork } from '../helpers/api';
import { parseError } from '../helpers/utilities';
import {
  accountUpdateAccountAddress,
  accountUpdateNetwork,
  accountUpdateWeb3
} from './_account';
import { notificationShow } from './_notification';
import { PortisProvider } from 'portis';
import Web3 from 'web3';
// -- Constants ------------------------------------------------------------- //
const PORTIS_CONNECT_REQUEST = 'portis/PORTIS_CONNECT_REQUEST';
const PORTIS_CONNECT_SUCCESS = 'portis/PORTIS_CONNECT_SUCCESS';
const PORTIS_CONNECT_FAILURE = 'portis/PORTIS_CONNECT_FAILURE';

const PORTIS_NOT_AVAILABLE = 'portis/PORTIS_NOT_AVAILABLE';

const PORTIS_UPDATE_PORTIS_ACCOUNT = 'portis/PORTIS_UPDATE_PORTIS_ACCOUNT';

// -- Actions --------------------------------------------------------------- //

export const updateAccountAddress = accountAddress => dispatch => {
  if (accountAddress) {
    dispatch(accountUpdateAccountAddress(accountAddress, 'PORTIS'));
    window.browserHistory.push('/domains');
  }
};

export const portisUpdatePortisAccount = address => (dispatch, getState) => {
  if (address !== getState().portis.accountAddress) {
    dispatch({
      type: PORTIS_UPDATE_PORTIS_ACCOUNT,
      payload: address
    });
    dispatch(updateAccountAddress(address));
  }
};

export const portisConnectInit = () => (dispatch, getState) => {
  const web3 = new Web3(
    new PortisProvider({
      apiKey: '1cd61de82681d63b30620c48339f7c97'
    })
  );
  web3.eth
    .getAccounts((err, accounts) => {
      if (err) {
        return;
      }
      const accountAddress = accounts[0];
      web3.eth.defaultAccount = accountAddress;
      if (web3.currentProvider.isPortis) {
        dispatch(updateAccountAddress(accountAddress));
        dispatch({ type: PORTIS_CONNECT_REQUEST });
        apiGetPortisNetwork(web3)
          .then(network => {
            dispatch({ type: PORTIS_CONNECT_SUCCESS, payload: network });
            dispatch(accountUpdateNetwork(network));
            dispatch(accountUpdateWeb3(web3));
            dispatch(portisUpdatePortisAccount(accountAddress));
          })
          .catch(error => {
            const message = parseError(error);
            dispatch(notificationShow(message, true));
            dispatch({ type: PORTIS_CONNECT_FAILURE });
          });
      } else {
        dispatch(notificationShow('Install Portis first', false));
        dispatch({ type: PORTIS_NOT_AVAILABLE });
      }
    })
    .catch(err => {
      dispatch(notificationShow('Failed To Connect To Portis', true));
      dispatch({ type: PORTIS_CONNECT_FAILURE });
    });
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
    case PORTIS_CONNECT_REQUEST:
      return {
        ...state,
        fetching: true,
        web3Available: false
      };
    case PORTIS_CONNECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        web3Available: true,
        network: action.payload
      };
    case PORTIS_CONNECT_FAILURE:
      return {
        ...state,
        fetching: false,
        web3Available: true
      };
    case PORTIS_NOT_AVAILABLE:
      return {
        ...state,
        fetching: false,
        web3Available: false
      };
    case PORTIS_UPDATE_PORTIS_ACCOUNT:
      return {
        ...state,
        accountAddress: action.payload
      };
    default:
      return state;
  }
};
