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
  src: 'https://i.imgur.com/jPr0yfo.png',
  crossOrigin: 'Anonymous',
  whereFrom: 'fromLink',
};

export const imagesSlide = [
  {
    src: 'https://i.imgur.com/TiaRZ60.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 1,
  },
  {
    src: 'https://i.imgur.com/cIF8ZDi.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 2,
  },
  {
    src: 'https://i.imgur.com/264iS1T.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 3,
  },
  {
    src: 'https://i.imgur.com/7tPRwp8.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 4,
  },
  {
    src: 'https://i.imgur.com/tLxA2Gg.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 5,
  },
  {
    src: 'https://i.imgur.com/2jtPB45.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 6,
  },
  {
    src: 'https://i.imgur.com/i6U3KqQ.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 7,
  },
  {
    src: 'https://i.imgur.com/2RlyVSh.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 8,
  },
  {
    src: 'https://i.imgur.com/70ICXxQ.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 9,
  },
  {
    src: 'https://i.imgur.com/bhX4P8R.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 10,
  },
  {
    src: 'https://i.imgur.com/jPr0yfo.png',
    crossOrigin: 'Anonymous',
    whereFrom: 'fromLink',
    key: 11,
  },
];

export const initialState = fromJS({
  uploadInput,
  image,
  loadedImage: {},
  textAttrs,
  base64Meme: '',
  latestUpload: { url: 'urlImage' },
  imagesSlide,
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
