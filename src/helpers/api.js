import axios from "axios";
import networks from "../ref/networks.json";

/**
 * @desc get metmask selected network
 * @return {Promise}
 */
export const apiGetMetamaskNetwork = () =>
  new Promise((resolve, reject) => {
    if (typeof window.web3 !== "undefined") {
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
 * @desc get portis selected network
 * @return {Promise}
 */
export const apiGetPortisNetwork = web3 =>
  new Promise((resolve, reject) => {
    web3.eth.net
      .getNetworkType()
      .then(network => resolve(network === "main" ? "mainnet" : network));
  });

/**
 * Configuration for balance api
 * @type axios instance
 */

const api = axios.create({
  baseURL: "https://blockscout.com/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export async function apiGetTransaction(txHash, network) {
  const chain = "eth";
  const module = "transaction";
  const action = "gettxinfo";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&txhash=${txHash}`;
  const response = await api.get(url);
  return response;
}
