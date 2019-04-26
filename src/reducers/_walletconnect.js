import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { parseError, getNetworkFromChainId } from "../helpers/utilities";
import {
  accountUpdateAccountAddress,
  accountUpdateNetwork,
  accountUpdateWeb3
} from "./_account";
import { notificationShow } from "./_notification";

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

const WALLETCONNECT_CLEAR_STATE = "walletconnect/WALLETCONNECT_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const walletconnectUpdateAccount = address => (dispatch, getState) => {
  if (address !== getState().walletconnect.accountAddress) {
    dispatch({
      type: WALLETCONNECT_UPDATE_WALLETCONNECT_ACCOUNT,
      payload: address
    });
    if (address) {
      dispatch(accountUpdateAccountAddress(address, "WALLETCONNECT"));
      window.browserHistory.push("/domains");
    }
  }
};

export const walletconnectConnectInit = () => async (dispatch, getState) => {
  dispatch({ type: WALLETCONNECT_CONNECT_REQUEST });
  try {
    const provider = new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org"
    });

    console.log("[walletconnectConnectInit] provider", provider);

    const web3 = new Web3(provider);

    console.log("[walletconnectConnectInit] web3", web3);

    const accounts = await web3.eth.getAccounts();

    console.log("[walletconnectConnectInit] accounts", accounts);

    const accountAddress = accounts[0];
    web3.eth.defaultAccount = accountAddress;

    const chainId = web3.currentProvider._walletConnector.chainId;
    console.log("[walletconnectConnectInit] chainId", chainId);
    const network = getNetworkFromChainId(chainId);

    dispatch({ type: WALLETCONNECT_CONNECT_SUCCESS, payload: network });
    dispatch(accountUpdateNetwork(network));
    dispatch(accountUpdateWeb3(web3));
    dispatch(walletconnectUpdateAccount(accountAddress));
  } catch (error) {
    const message = parseError(error) || "Failed To Connect To WalletConnect";
    dispatch(notificationShow(message, true));
    dispatch({ type: WALLETCONNECT_CONNECT_FAILURE });
  }
};

export const walletconnectClearState = () => dispatch => {
  dispatch({ type: WALLETCONNECT_CLEAR_STATE });
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
    case WALLETCONNECT_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
