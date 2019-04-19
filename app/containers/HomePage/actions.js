/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  CHANGE_USERNAME,
  LOAD_MEMES,
  LOAD_MEMES_SUCCESS,
  LIKE_DISLIKE,
  UPDATE_MEME_AFTER_LIKE,
  REMOVE_POST,
  REMOVE_POST_CDN_FAIL,
  REMOVE_POST_DB,
  REMOVE_POST_DB_FAIL,
  REMOVE_POST_SUCCESS,
  REPORT_MEME_SLIDE,
  REPORT_MEME_SLIDE_SUCCESS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function changeUsername(name) {
  return {
    type: CHANGE_USERNAME,
    name,
  };
}

export function loadMemes(limit, offset, userID) {
  return {
    type: LOAD_MEMES,
    limit,
    offset,
    userID,
  };
}

export function loadMemesSuccess(memes) {
  return {
    type: LOAD_MEMES_SUCCESS,
    memes,
  };
}

export function likeDislike(likeDislikeObjToSend) {
  return {
    type: LIKE_DISLIKE,
    likeDislikeObjToSend,
  };
}

export function updateMemeAfterLike(newMeme) {
  return {
    type: UPDATE_MEME_AFTER_LIKE,
    newMeme,
  };
}

export function reportMemesSlide(idPost) {
  return {
    type: REPORT_MEME_SLIDE,
    idPost,
  };
}

export function reportMemesSlideSucces(post) {
  return {
    type: REPORT_MEME_SLIDE_SUCCESS,
    post,
  };
}

export function removePost(indexPost, idPost, deletehash) {
  return {
    type: REMOVE_POST,
    indexPost,
    idPost,
    deletehash,
  };
}

export function removePostCDNFail(indexPost, idPost, error) {
  return {
    type: REMOVE_POST_CDN_FAIL,
    indexPost,
    idPost,
    error,
  };
}

export function removePostDB(indexPost, idPost) {
  return {
    type: REMOVE_POST_DB,
    indexPost,
    idPost,
  };
}

export function removePostDBFail(indexPost, idPost, error) {
  return {
    type: REMOVE_POST_DB_FAIL,
    indexPost,
    idPost,
    error,
  };
}

export function removePostSuccess(indexPost, idPost) {
  return {
    type: REMOVE_POST_SUCCESS,
    indexPost,
    idPost,
  };
}
