/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  SET_USER_PROFILE,
  CHANGE_DRAWER_OPEN,
  USER_DB_FOUND,
  USER_DB_ERROR,
  USER_DB_NOT_FOUND,
  UPDATE_GRID_PROPS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  drawerOpen: false,
  dbUser: {},
  dbUserError: {},
  gridProps: { limit: 0, offset: 100, pages: 1 },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state.set('error', action.error).set('loading', false);
    case SET_USER_PROFILE:
      return state.set('userProfile', action.userProfile);
    case CHANGE_DRAWER_OPEN:
      return state.set('drawerOpen', !state.set('drawerOpen'));
    case USER_DB_FOUND:
      return state.set('dbUser', action.profile);
    case USER_DB_ERROR:
      return state.set('dbUserError', action.msg);
    case USER_DB_NOT_FOUND:
      return state.set('dbUserError', action);
    case UPDATE_GRID_PROPS:
      return state.set('gridProps', action.gridProps);
    default:
      return state;
  }
}

export default appReducer;
