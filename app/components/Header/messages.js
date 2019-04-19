/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home',
  },
  features: {
    id: `${scope}.features`,
    defaultMessage: 'Features',
  },
  logIn: {
    id: `${scope}.login`,
    defaultMessage: 'Log In',
  },
  logOut: {
    id: `${scope}.logOut`,
    defaultMessage: 'Log Out',
  },
  allMemes: {
    id: `${scope}.allMemes`,
    defaultMessage: 'All MeMeS',
  },
  myMemes: {
    id: `${scope}.myMemes`,
    defaultMessage: 'My MeMeS',
  },
  makeMeme: {
    id: `${scope}.makeMeme`,
    defaultMessage: 'Make MeMe',
  },
});
