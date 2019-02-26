/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRouter = state => state.get('router');

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.get('currentUser'));

const selectUserProfile = () =>
  createSelector(selectGlobal, globalState => globalState.get('userProfile'));

const selectDrawerOpen = () =>
  createSelector(selectGlobal, globalState => globalState.get('drawerOpen'));

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('loading'));

const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.get('error'));

const makeSelectRepos = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['userData', 'repositories']),
  );

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState =>
    routerState.get('location').toJS(),
  );

const makeSelecDBUser = () =>
  createSelector(selectGlobal, globalState => globalState.get('dbUser'));

const makeSelecDBUserError = () =>
  createSelector(selectGlobal, globalState => globalState.get('dbUserError'));

const makeSelecGridProps = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('gridProps').toJS(),
  );

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  selectUserProfile,
  selectDrawerOpen,
  makeSelecDBUser,
  makeSelecDBUserError,
  makeSelecGridProps,
};
