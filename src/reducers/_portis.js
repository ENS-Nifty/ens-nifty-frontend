import { apiGetPortisNetwork } from "../helpers/api";
import { parseError } from "../helpers/utilities";
import {
  accountUpdateAccountAddress,
  accountUpdateNetwork,
  accountUpdateWeb3
} from "./_account";
import { notificationShow } from "./_notification";
import Portis from "@portis/web3";
import Web3 from "web3";
// -- Constants ------------------------------------------------------------- //
const PORTIS_CONNECT_REQUEST = "portis/PORTIS_CONNECT_REQUEST";
const PORTIS_CONNECT_SUCCESS = "portis/PORTIS_CONNECT_SUCCESS";
const PORTIS_CONNECT_FAILURE = "portis/PORTIS_CONNECT_FAILURE";

const PORTIS_NOT_AVAILABLE = "portis/PORTIS_NOT_AVAILABLE";

const PORTIS_UPDATE_PORTIS_ACCOUNT = "portis/PORTIS_UPDATE_PORTIS_ACCOUNT";

const PORTIS_CLEAR_STATE = "portis/PORTIS_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

let accountInterval = null;

export const updateAccountAddress = accountAddress => dispatch => {
  if (accountAddress) {
    dispatch(accountUpdateAccountAddress(accountAddress, "PORTIS"));
    window.browserHistory.push("/domains");
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

export const portisConnectInit = () => async (dispatch, getState) => {
  const { network } = getState().portis;

  const portis = new Portis(process.env.REACT_APP_PORTIS_DAPP_ID, "mainnet");

  const web3 = new Web3(portis.provider);

  dispatch({ type: PORTIS_CONNECT_REQUEST });
  web3.eth
    .getAccounts((error, accounts) => {
      if (error) {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: PORTIS_CONNECT_FAILURE });
        return;
      }
      const accountAddress = accounts[0];
      web3.eth.defaultAccount = accountAddress;
      if (web3.currentProvider.isPortis) {
        dispatch(updateAccountAddress(accountAddress));
        dispatch({ type: PORTIS_CONNECT_SUCCESS, payload: network });
        dispatch(accountUpdateNetwork(network));
        dispatch(accountUpdateWeb3(web3));
        dispatch(portisUpdatePortisAccount(accountAddress));
      } else {
        dispatch(notificationShow("Install Portis first", false));
        dispatch({ type: PORTIS_NOT_AVAILABLE });
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(notificationShow("Failed To Connect To Portis", true));
      dispatch({ type: PORTIS_CONNECT_FAILURE });
    });
};

export const portisClearIntervals = () => dispatch => {
  clearInterval(accountInterval);
};

export const portisClearState = () => dispatch => {
  dispatch(portisClearIntervals());
  dispatch({ type: PORTIS_CLEAR_STATE });
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
    case PORTIS_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
