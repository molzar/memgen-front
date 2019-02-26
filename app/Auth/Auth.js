import auth0 from 'auth0-js';
import cookie from 'react-cookies';

const REACT_APP_AUTH0_DOMAIN = 'security-tutorial-dev.auth0.com';
const REACT_APP_AUTH0_CLIENTID = '0rUZeeV3RT8GmXHeMxaItjgBjsIWgNV5';
const REACT_APP_AUTH0_CALLBACK_URL = 'http://localhost:3000/callback';
const REACT_APP_AUTH0_AUDIENCE = 'http://localhost:3001';
// const REACT_APP_API_URL = 'http://localhost:3001';
const REDIRECT_ON_LOGIN = 'redirect_on_login';
// eslint-disable-next-line
let _idToken = null;
// eslint-disable-next-line
let _accessToken = null;
// eslint-disable-next-line
let _scopes = null;
// eslint-disable-next-line
let _expiresAt = null;

export default class Auth {
  constructor(history, setProfile, checkDBUser) {
    this.history = history;
    this.setProfile = setProfile;
    this.checkDBUser = checkDBUser;
    this.requestedScopes = 'openid profile email';

    this.auth0 = new auth0.WebAuth({
      domain: REACT_APP_AUTH0_DOMAIN,
      clientID: REACT_APP_AUTH0_CLIENTID,
      redirectUri: REACT_APP_AUTH0_CALLBACK_URL,
      audience: REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: this.requestedScopes,
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location),
    );
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.auth0.client.userInfo(
          this.getAccessToken(),
          (errInfo, profile) => {
            this.setProfile(profile);
            this.checkDBUser(profile);
          },
        );

        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) &&
          JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN)).pathname
            ? JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN)).pathname
            : '/';
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        // eslint-disable-next-line
        alert(`Error: ${err.error}. Check the console for more details.`);
        // eslint-disable-next-line
        console.table(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = authResult => {
    cookie.save(
      'expiresAt',
      authResult.expiresIn * 100000 + new Date().getTime(),
      { path: '/' },
    );
    cookie.save('scopes', authResult.scope || this.requestedScopes || '', {
      path: '/',
    });
    cookie.save('accessToken', authResult.accessToken, { path: '/' });
    cookie.save('idToken', authResult.idToken, { path: '/' });
  };

  isAuthenticated() {
    return new Date().getTime() < cookie.load('expiresAt');
  }

  logout = () => {
    this.auth0.logout({
      clientID: REACT_APP_AUTH0_CLIENTID,
      returnTo: 'http://localhost:3000',
    });
    this.clearCookies();
  };

  clearCookies() {
    cookie.remove('expiresAt', { path: '/' });
    cookie.remove('scopes', { path: '/' });
    cookie.remove('accessToken', { path: '/' });
    cookie.remove('idToken', { path: '/' });
  }

  getAccessToken = () => {
    const accessToken = cookie.load('accessToken');
    if (!accessToken) {
      this.login(); // throw new Error('No access token found.');
    }
    return accessToken;
  };

  getProfile = cb => {
    if (this.auth0) {
      this.auth0.client.userInfo(cookie.load('accessToken'), (err, profile) => {
        if (profile) {
          this.setProfile(profile);
          this.checkDBUser(profile);
        } else {
          this.clearCookies();
          this.login();
        }
        cb(err, profile);
      });
    }
    cb('ERROR', '');
  };

  userHasScopes = scopes => {
    const grantedScopes = (cookie.load('scopes') || '').split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  };
}
