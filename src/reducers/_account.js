import { apiGetTransaction } from '../helpers/api';
import { parseError } from '../helpers/utilities';
import { web3SetHttpProvider } from '../helpers/web3';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST';
const ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS';
const ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE =
  'account/ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE';

const ACCOUNT_UPDATE_ACCOUNT_ADDRESS = 'account/ACCOUNT_UPDATE_ACCOUNT_ADDRESS';

const ACCOUNT_UPDATE_NETWORK = 'account/ACCOUNT_UPDATE_NETWORK';

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

export const accountUpdateAccountAddress = (accountAddress, accountType) => (
  dispatch,
  getState
) => {
  if (!accountAddress || !accountType) return;
  const { network } = getState().account;
  if (getState().account.accountType !== accountType)
    dispatch(accountClearState());
  dispatch({
    type: ACCOUNT_UPDATE_ACCOUNT_ADDRESS,
    payload: { accountAddress, accountType }
  });
  dispatch(accountUpdateNetwork(network));
};

export const accountClearState = () => dispatch => {
  dispatch({ type: ACCOUNT_CLEAR_STATE });
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  nativePriceRequest: 'USD',
  nativeCurrency: 'USD',
  prices: {},
  network: 'mainnet',
  accountType: '',
  accountAddress: '',
  accountInfo: {
    address: '',
    accountType: '',
    assets: [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        address: null,
        decimals: 18,
        balance: {
          amount: '',
          display: '0.00 ETH'
        },
        native: null
      }
    ],
    total: '———'
  },
  transactions: [],
  uniqueTokens: [],
  shapeshiftAvailable: true,
  fetchingShapeshift: false,
  fetchingTransactions: false,
  fetchingUniqueTokens: false,
  fetching: false,
  hasPendingTransaction: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE_ACCOUNT_ADDRESS:
      return {
        ...state,
        accountType: action.payload.accountType,
        accountAddress: action.payload.accountAddress,
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
    case ACCOUNT_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
