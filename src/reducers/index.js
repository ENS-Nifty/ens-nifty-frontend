import { combineReducers } from 'redux';
import { authReducer } from './_auth';

export default combineReducers({
  auth: authReducer
});
