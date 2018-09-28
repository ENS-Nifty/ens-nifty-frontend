import {parseError} from "../helpers/utilities";
import {getWalletConnectWeb3, createWalletConnectSession} from '../helpers/walletconnect'
import {
  accountUpdateAccountAddress,
  accountUpdateNetwork,
  accountUpdateWeb3
} from "./_account";
import {notificationShow} from "./_notification";

// -- Constants ------------------------------------------------------------- //
const WALLETCONNECT_CONNECT_REQUEST =
  "walletconnect/WALLETCONNECT_CONNECT_REQUEST";
const WALLETCONNECT_CONNECT_SUCCESS =
  "walletconnect/WALLETCONNECT_CONNECT_SUCCESS";
const WALLETCONNECT_CONNECT_FAILURE =
  "walletconnect/WALLETCONNECT_CONNECT_FAILURE";

const WALLETCONNECT_NOT_AVAILABLE = "walletconnect/WALLETCONNECT_NOT_AVAILABLE";

const WALLETCONNECT_UPDATE_WALLETCONNECT_ACCOUNT =
  "walletconnect/WALLETCONNECT_UPDATE_WALLETCONNECT_ACCOUNT";

// -- Actions --------------------------------------------------------------- //

export const updateAccountAddress = accountAddress => dispatch => {
  if (accountAddress) {
    dispatch(accountUpdateAccountAddress(accountAddress, "WALLETCONNECT"));
    window.browserHistory.push("/domains");
  }
};

export const walletconnectUpdateWalletConnectAccount = address => (
  dispatch,
  getState
) => {
  if (address !== getState().walletconnect.accountAddress) {
    dispatch({
      type: WALLETCONNECT_UPDATE_WALLETCONNECT_ACCOUNT,
      payload: address
    });
    dispatch(updateAccountAddress(address));
  }
};

export const walletconnectConnectInit = () => (dispatch, getState) => {
  const network = "mainnet";
  const web3 = getWalletConnectWeb3(network)

  const handleAccounts = accounts => {
    const accountAddress = accounts[0];
    dispatch(updateAccountAddress(accountAddress));
    dispatch({ type: WALLETCONNECT_CONNECT_SUCCESS, payload: network });
    dispatch(accountUpdateNetwork(network));
    dispatch(accountUpdateWeb3(window.web3));
    dispatch(walletconnectUpdateWalletConnectAccount());
  }

  dispatch({ type: WALLETCONNECT_CONNECT_REQUEST });
  web3.eth
    .getAccounts()
    .then((err, accounts) => {
      if (!accounts && !accounts.length) {
        createWalletConnectSession()
        .then(accounts => {
          handleAccounts(accounts)
        })
        .catch((error) => {
          const message = parseError(error);
          dispatch(notificationShow(message, true));
          dispatch({type: WALLETCONNECT_CONNECT_FAILURE});
        })
     } else {
        handleAccounts(accounts)
      }
    })
    .catch((error) => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({type: WALLETCONNECT_CONNECT_FAILURE});
    })
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  accountAddress: "",
  web3Available: false,
  network: "mainnet"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WALLETCONNECT_CONNECT_REQUEST:
      return {
        ...state,
        fetching: true,
        web3Available: false
      };
    case WALLETCONNECT_CONNECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        web3Available: true,
        network: action.payload
      };
    case WALLETCONNECT_CONNECT_FAILURE:
      return {
        ...state,
        fetching: false,
        web3Available: true
      };
    case WALLETCONNECT_NOT_AVAILABLE:
      return {
        ...state,
        fetching: false,
        web3Available: false
      };
    case WALLETCONNECT_UPDATE_WALLETCONNECT_ACCOUNT:
      return {
        ...state,
        accountAddress: action.payload
      };
    default:
      return state;
  }
};
