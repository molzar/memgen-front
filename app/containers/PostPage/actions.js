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
  LIKE_DISLIKE,
  CHANGE_MIN_MAX_INDEX,
  UPDATE_MEME_AFTER_LIKE,
  GET_COMMENTS,
  GET_COMMENTS_SUCCESS,
  POST_COMMENT,
  POST_COMMENT_SUCCESS,
  EDIT_COMMENT,
  LOAD_MEMES_SLIDE,
  LOAD_MEMES_SLIDE_SUCCESS,
  REMOVE_COMMENT,
  REMOVE_COMMENT_SUCCESS,
  CHANGE_COMMENTS_NUMBER,
} from './constants';
/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function loadMemesSlide(
  idPost,
  idUser,
  includeIdPost,
  whereToLoad,
  limit,
) {
  return {
    type: LOAD_MEMES_SLIDE,
    idPost,
    idUser,
    includeIdPost,
    whereToLoad,
    limit,
  };
}

export function loadMemesSlideSucces(memes, whereToLoad) {
  return {
    type: LOAD_MEMES_SLIDE_SUCCESS,
    memes,
    whereToLoad,
  };
}

export function changeMinMaxIndex(memesLength, whereToLoad) {
  return {
    type: CHANGE_MIN_MAX_INDEX,
    memesLength,
    whereToLoad,
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

export function getComments(idPost, limit, offset, idParent) {
  return {
    type: GET_COMMENTS,
    idPost,
    limit,
    offset,
    idParent,
  };
}

export function changeCommentNumber(idPost, nbrComment, idParent) {
  return {
    type: CHANGE_COMMENTS_NUMBER,
    idPost,
    nbrComment,
    idParent,
  };
}

export function getCommentsSucces(idPost, comments, idParent) {
  return {
    type: GET_COMMENTS_SUCCESS,
    idPost,
    comments,
    idParent,
  };
}

export function postComment(comment) {
  return {
    type: POST_COMMENT,
    comment,
  };
}
export function editComment(comment) {
  return {
    type: EDIT_COMMENT,
    comment,
  };
}

export function postCommentSucces(comments) {
  return {
    type: POST_COMMENT_SUCCESS,
    comments,
  };
}

export function removeComment(postId, commentId) {
  return {
    type: REMOVE_COMMENT,
    postId,
    commentId,
  };
}

export function removeCommentsSucces(idPost, commentId, idParent) {
  return {
    type: REMOVE_COMMENT_SUCCESS,
    idPost,
    commentId,
    idParent,
  };
}
