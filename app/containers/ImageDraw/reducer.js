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
  MAKE_MEME,
  CHANGE_TEXT,
  SET_LOADED_IMAGE,
  SET_UPLOAD_INPUT,
  RESET_STATE,
  INSERT_POST_DB_SUCCES,
  LOAD_IMAGE_SUCCESS,
  LOAD_IMAGE_FAIL,
} from './constants';

export const uploadInput = {
  placeHolder: 'Upload Your Image',
  value: '',
};

export const textAttrs = {
  txt1: {
    text: {
      x: 10,
      y: 10,
      fontSize: 30,
      fontFamily: 'Impact',
      fill: 'white',
      text: 'Change Me Now',
      stroke: 'black',
    },
    displayColorPicker: false,
    color: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
  },
  txt2: {
    text: {
      x: 23,
      y: 196,
      fontSize: 30,
      fontFamily: 'Impact',
      fill: 'white',
      text: 'Drag Me Later',
      stroke: 'black',
    },
    displayColorPicker: false,
    color: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
  },
};

export const image = {
  src: `/api/proxy/${encodeURIComponent('https://i.imgur.com/6qCxMKM.png')}`,
  crossOrigin: 'Anonymous',
  width: 236,
  height: 213,
};

export const initialState = fromJS({
  uploadInput,
  image,
  loadedImage: {},
  textAttrs,
  base64Meme: '',
  latestUpload: { url: 'urlImage' },
});

function imageDrawReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_IMAGE_SUCCESS:
      return state.set('image', action.image);
    case LOAD_IMAGE_FAIL:
      return state.set('msg', action.msg);
    case SET_LOADED_IMAGE:
      return state.set('loadedImage', action.loadedImage);
    case SET_UPLOAD_INPUT:
      return state.set('uploadInput', action.uploadInput);
    case CHANGE_TEXT:
      return state.set('textAttrs', action.textAttrs);
    case MAKE_MEME:
      return state.set('base64Meme', action.base64Meme);
    case RESET_STATE:
      return state.set('base64Meme', '');
    case INSERT_POST_DB_SUCCES:
      return state.set('latestUpload', action.post);
    default:
      return state;
  }
}

export default imageDrawReducer;
