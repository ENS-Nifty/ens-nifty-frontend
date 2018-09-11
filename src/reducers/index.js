import {combineReducers} from 'redux';
import account from './_account';
import metamask from './_metamask';
import portis from './_portis';
import notification from './_notification';
import tokenize from './_tokenize';
import warning from './_warning';

export default combineReducers({
  account,
  metamask,
  portis,
  notification,
  tokenize,
  warning,
});
