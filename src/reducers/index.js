import { combineReducers } from 'redux';
import account from './_account';
import metamask from './_metamask';
import notification from './_notification';
import register from './_register';
import warning from './_warning';

export default combineReducers({
  account,
  metamask,
  notification,
  register,
  warning
});
