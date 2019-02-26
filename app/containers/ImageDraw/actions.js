import {
  CHANGE_TEXT,
  LOAD_IMAGE,
  LOAD_IMAGE_SUCCESS,
  LOAD_IMAGE_FAIL,
  MAKE_MEME,
  SET_LOADED_IMAGE,
  SET_UPLOAD_INPUT,
  RESET_STATE,
  UPLOAD_IMAGE,
  INSERT_POST_DB_ERROR,
  INSERT_POST_DB_SUCCES,
  UPLOAD_IMAGE_ERROR,
  INSERT_POST_DB,
} from './constants';

export function loadTextAttrs(textAttrs) {
  return {
    type: CHANGE_TEXT,
    textAttrs,
  };
}

export function setTextXY(x, y) {
  return {
    type: CHANGE_TEXT,
    x,
    y,
  };
}

export function loadImage(image) {
  return {
    type: LOAD_IMAGE,
    image,
  };
}

export function loadImageSuccess(image) {
  return {
    type: LOAD_IMAGE_SUCCESS,
    image,
  };
}

export function loadImageFail(msg) {
  return {
    type: LOAD_IMAGE_FAIL,
    msg,
  };
}

export function setLoadedImage(loadedImage) {
  return {
    type: SET_LOADED_IMAGE,
    loadedImage,
  };
}

export function setUploadInput(uploadInput) {
  return {
    type: SET_UPLOAD_INPUT,
    uploadInput,
  };
}

export function setBase64Meme(base64Meme) {
  return {
    type: MAKE_MEME,
    base64Meme,
  };
}

export function resetState() {
  return {
    type: RESET_STATE,
  };
}

export function uploadImage(base64Meme, profile) {
  return {
    type: UPLOAD_IMAGE,
    base64Meme,
    profile,
  };
}

export function uploadImageFail(msg) {
  return {
    type: UPLOAD_IMAGE_ERROR,
    msg,
  };
}

export function insertPostDB(responsUpload, profile) {
  return {
    type: INSERT_POST_DB,
    responsUpload,
    profile,
  };
}

export function insertPostDBSucces(post) {
  return {
    type: INSERT_POST_DB_SUCCES,
    post,
  };
}

export function insertPostDBFail(msg) {
  return {
    type: INSERT_POST_DB_ERROR,
    msg,
  };
}
