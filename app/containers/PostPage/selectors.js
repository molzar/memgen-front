/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPost = state => state.get('post', initialState);

const makeSelecMemesSlide = () =>
  createSelector(selectPost, postState => postState.get('memes').toJS());

const makeSelectComments = () =>
  createSelector(selectPost, postState => postState.get('comments').toJS());

const makeSelectBoundries = () =>
  createSelector(selectPost, postState => postState.get('boundries').toJS());

export {
  selectPost,
  makeSelecMemesSlide,
  makeSelectComments,
  makeSelectBoundries,
};
