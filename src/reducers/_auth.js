import { apiLogin, apiLogout } from '../helpers/api';
import { getSession, setSession, deleteSession } from '../helpers/utilities';

// -- Constants ------------------------------------------------------------- //
const AUTH_REQUEST = 'auth/AUTH_REQUEST';
const AUTH_SUCCESS = 'auth/AUTH_SUCCESS';
const AUTH_FAILURE = 'auth/AUTH_FAILURE';
const AUTH_SIGNOUT_REQUEST = 'auth/AUTH_SIGNOUT_REQUEST';
const AUTH_SIGNOUT_SUCCESS = 'auth/AUTH_SIGNOUT_SUCCESS';
const AUTH_UPDATE_EMAIL = 'auth/AUTH_UPDATE_EMAIL';
const AUTH_UPDATE_PASSWORD = 'auth/AUTH_UPDATE_PASSWORD';

// -- Actions --------------------------------------------------------------- //
export const authLogin = (email, password) => dispatch => {
  dispatch({ type: AUTH_REQUEST });
  const authHandler = (error, user) => {
    if (error) return dispatch({ type: AUTH_FAILURE });
    setSession(
      user.uid,
      user.email,
      user.profile,
      Date.now() + 300000 // 5 minutes
    );
    dispatch({
      type: AUTH_SUCCESS,
      payload: getSession()
    });
    window.browserHistory.push('/dashboard');
  };
  apiLogin(email, password, authHandler);
};

export const authLogout = () => dispatch => {
  dispatch({ type: AUTH_SIGNOUT_REQUEST });
  apiLogout().then(() => {
    deleteSession();
    dispatch({ type: AUTH_SIGNOUT_SUCCESS });
    window.browserHistory.push('/login');
  });
};

export const authUpdateEmail = email => ({
  type: AUTH_UPDATE_EMAIL,
  payload: email
});

export const authUpdatePassword = password => ({
  type: AUTH_UPDATE_PASSWORD,
  payload: password
});

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  uid: '',
  email: '',
  password: '',
  profile: ''
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
    case AUTH_SIGNOUT_REQUEST:
      return { ...state, fetching: true };
    case AUTH_SUCCESS:
      return {
        ...state,
        fetching: false,
        password: '',
        uid: action.payload.uid,
        email: action.payload.email,
        profile: action.payload.profile
      };
    case AUTH_SIGNOUT_SUCCESS:
      return {
        ...state,
        fetching: false,
        password: '',
        uid: '',
        email: '',
        profile: ''
      };
    case AUTH_FAILURE:
      return { ...state, fetching: false };
    case AUTH_UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case AUTH_UPDATE_PASSWORD:
      return { ...state, password: action.payload };
    default:
      return state;
  }
};
