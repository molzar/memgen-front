/*
 * HomeReducer
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
  CHANGE_USERNAME,
  LOAD_MEMES_SUCCESS,
  UPDATE_MEME_AFTER_LIKE,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  username: '',
  memes: [],
  comments: [],
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      // Delete prefixed '@' from the github username
      return state.set('username', action.name.replace(/@/gi, ''));
    case LOAD_MEMES_SUCCESS:
      return state.set('memes', fromJS(action.memes));
    case UPDATE_MEME_AFTER_LIKE: {
      const oldMemes = state.get('memes').toJS();
      oldMemes[oldMemes.findIndex(meme => meme.id === action.newMeme.id)] =
        action.newMeme;
      return state.set('memes', fromJS(oldMemes));
    }
    default:
      return state;
  }
}

export default homeReducer;
