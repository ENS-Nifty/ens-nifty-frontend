import axios from 'axios';

/**
 * Configuration for  api instance
 * @type axios instance
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

/**
 * @desc validate and login user session
 * @param  {String} [email='']
 * @param  {String} [password='']
 * @return {Promise}
 */
export const apiLogin = (email = '', password = '') =>
  api.post('/session', { email, password });


  /**
   * @desc logout authed user session
   * @return {Promise}
   */
export const apiLogout = () =>
  api.delete('/session');
