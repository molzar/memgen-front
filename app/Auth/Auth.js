import auth0 from 'auth0-js';
import cookie from 'react-cookies';

import Config from '../../server/conf/config';

export default class Auth {
  constructor(history, setProfile, checkDBUser) {
    this.history = history;
    this.setProfile = setProfile;
    this.checkDBUser = checkDBUser;
    this.requestedScopes = 'openid profile email';

    this.auth0 = new auth0.WebAuth({
      domain: Config.auth0Domain,
      clientID: Config.auth0Clientid,
      redirectUri: `${window.location.origin}/callback`,
      audience: Config.auth0Audience,
      responseType: 'token id_token',
      scope: this.requestedScopes,
    });
  }

  login = () => {
    localStorage.setItem(
      Config.redirectOnLogin,
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
          localStorage.getItem(Config.redirectOnLogin) &&
          JSON.parse(localStorage.getItem(Config.redirectOnLogin)).pathname
            ? JSON.parse(localStorage.getItem(Config.redirectOnLogin)).pathname
            : '/';
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        // eslint-disable-next-line
        alert(`Error: ${err.error}. Check the console for more details.`);
        // eslint-disable-next-line
        console.table(err);
      }
      localStorage.removeItem(Config.redirectOnLogin);
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
      clientID: Config.auth0Clientid,
      returnTo: `http://${Config.appHost}:${Config.appPort}`,
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
          this.logout();
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
