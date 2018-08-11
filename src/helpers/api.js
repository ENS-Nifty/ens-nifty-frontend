import axios from 'axios';
import networks from '../ref/networks.json';

/**
 * @desc get metmask selected network
 * @return {Promise}
 */
export const apiGetMetamaskNetwork = () =>
  new Promise((resolve, reject) => {
    if (typeof window.web3 !== 'undefined') {
      window.web3.version.getNetwork((err, networkID) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        let networkIDList = {};
        Object.keys(networks).forEach(network => {
          networkIDList[networks[network].id] = network;
        });
        resolve(networkIDList[Number(networkID)] || null);
      });
    }
  });

/**
 * Configuration for balance api
 * @type axios instance
 */
const api = axios.create({
  baseURL: 'https://indexer.balance.io',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

/**
 * @desc get transaction data
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @param  {Number}   [page = 1]
 * @return {Promise}
 */
export const apiGetTransactionData = (
  address = '',
  network = 'mainnet',
  page = 1
) => api.get(`/get_transactions/${network}/${address}/${page}`);

/**
 * @desc get transaction
 * @param  {String}   [txnHash = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetTransaction = (txnHash = '', network = 'mainnet') =>
  api.get(`/get_transaction/${network}/${txnHash}`);

/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */
export const apiGetGasPrices = () => api.get(`/get_eth_gas_prices`);
