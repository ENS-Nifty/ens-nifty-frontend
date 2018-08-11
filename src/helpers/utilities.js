/**
 * @desc create authenticated user session
 * @param  {String} [uid='']
 * @param  {String} [email='']
 * @param  {String} [profile='']
 * @param  {Date} [expires=Date.now()]
 * @return {Session}
 */
export const setSession = (
  uid = '',
  email = '',
  displayName = '',
  expires = Date.now(),
  ) => {
  const session = {
    uid,
    email,
    displayName,
    expires,
  };
  localStorage.setItem('USER_SESSION', JSON.stringify(session));
};

/**
 * @desc get session as an object
 * @return {Object}
 */
export const getSession = () => {
  const session = localStorage.getItem('USER_SESSION');
  return JSON.parse(session);
};

/**
 * @desc update profile in session
 * @param  {String}  [profile='']
 * @return {Session}
 */
export const updateProfile = (profile = '') => {
  const newSession = { ...getSession(), profile };
  return localStorage.setItem('USER_SESSION', JSON.stringify(newSession));
};

/**
 * @desc delete session
 * @return {Void}
 */
export const deleteSession = () => {
  localStorage.removeItem('USER_SESSION');
};

/**
 * @desc get session status
 * @return {String}
 */
export const getSessionStatus = () => {
  const auth = getSession();
  if (auth && auth.expires > Date.now()) return 'LOGIN';
  return 'LOGOUT';
};

/**
 * @desc set and clear timeout for Session Expire Warning
 */
let timeout = null;
const refreshTimeout = (refreshTime) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.error('TIMEOUT');
  }, refreshTime);
};
export const clearSessionExpireWarning = () => {
  clearTimeout(timeout);
};

/**
 * @desc refresh sesion tokens
 * @return {Void}
 */
export const refreshSession = () => {
  const auth = getSession();

  const getRefreshedSession = (sessionObject, refreshTime) => {
    const newExpires = Date.now() + refreshTime;
    if (sessionObject.maxAge - newExpires > refreshTime) {
      sessionObject.expires = newExpires;
    } else sessionObject.expires = sessionObject.maxAge;
    return JSON.stringify(sessionObject);
  };

  if (auth) {
    localStorage.setItem('USER_SESSION', getRefreshedSession(auth, 300000)); // 5 min
    return refreshTimeout(240000); // 4 min
  }
};

/**
 * @desc detects mobile devices
 * @return {Boolean}
 */
export const isMobile = () => {
  if ('ontouchstart' in window && Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 800) return true;
  return false;
};
