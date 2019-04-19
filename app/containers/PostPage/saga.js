import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  loadMemesSlideSucces,
  updateMemeAfterLike,
  postCommentSucces,
  getCommentsSucces,
  removeCommentsSucces,
  changeCommentNumber,
  changeMinMaxIndex,
  reportMemesSlideSucces,
} from './actions';
import {
  LOAD_MEMES_SLIDE,
  LIKE_DISLIKE,
  GET_COMMENTS,
  REMOVE_COMMENT,
  POST_COMMENT,
  EDIT_COMMENT,
  REPORT_MEME_SLIDE,
} from './constants';

export function* loadMemesSlideSaga(action) {
  const requestURL = `/api/posts/getMemesSlide?idUser=${action.idUser}&idPost=${
    action.idPost
  }&includeIdPost=${action.includeIdPost}&whereToLoad=${
    action.whereToLoad
  }&limit=${action.limit}`;
  const options = {
    method: 'GET',
  };

  try {
    const memes = yield call(request, requestURL, options);
    if (!memes || !memes.success || !memes.data) {
      yield put(loadMemesSlideSucces([]));
    } else {
      yield put(loadMemesSlideSucces(memes.data, action.whereToLoad));
      yield put(changeMinMaxIndex(memes.data.length, action.whereToLoad));
    }
  } catch (err) {
    yield put(loadMemesSlideSucces([]));
  }
}

export function* insertLikePostUserDB(action) {
  const requestURL = `/api/likes?id_post=${
    action.likeDislikeObjToSend.postId
  }&id_user=${action.likeDislikeObjToSend.userId}&like=${
    action.likeDislikeObjToSend.like
  }`;

  const options = {
    method: 'POST',
  };
  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success || !response.data) {
      yield put(updateMemeAfterLike([]));
    } else {
      yield put(updateMemeAfterLike(response.data[0]));
    }
  } catch (err) {
    yield put(updateMemeAfterLike([]));
  }
}

export function* getComments(action) {
  const requestURL = `/api/comments/${action.idPost}/
    ${action.limit}&${action.offset}/
    ${action.idParent ? action.idParent : ''} `;
  const options = {
    method: 'GET',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(getCommentsSucces([]));
    } else {
      const localData = response.data;

      localData.forEach((k, v) => {
        localData[v].created_at = new Date(k.created_at).toGMTString();
        localData[v].updated_at = new Date(k.updated_at).toGMTString();
      });
      yield put(getCommentsSucces(action.idPost, localData, action.idParent));
    }
  } catch (err) {
    yield put(getCommentsSucces([]));
  }
}

export function* postComment(action) {
  const requestURL = `/api/comments?id_post=${action.comment.postId}&id_user=${
    action.comment.userId
  }&id_parent=${
    action.comment.idParent ? action.comment.idParent : ''
  }&text_comment=${action.comment.textComment}&limit=${
    action.comment.limit
  }&offset=${action.comment.offset}`;
  const options = {
    method: 'POST',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(postCommentSucces([]));
    } else {
      const localData = response.data;
      localData.forEach((k, v) => {
        localData[v].created_at = new Date(k.created_at).toGMTString();
        localData[v].updated_at = new Date(k.updated_at).toGMTString();
      });
      yield put(
        getCommentsSucces(
          action.comment.postId,
          localData,
          action.comment.idParent,
        ),
      );

      yield put(
        changeCommentNumber(
          action.comment.postId,
          localData[0] ? localData[0].nbrComments : 0,
          action.comment.idParent,
        ),
      );
    }
  } catch (err) {
    yield put(postCommentSucces([]));
  }
}

export function* editComment(action) {
  const requestURL = `/api/comments/${action.comment.id}?id_post=${
    action.comment.postId
  }&id_user=${action.comment.userId}&text_comment=${
    action.comment.textComment
  }&limit=${action.comment.limit}&offset=${action.comment.offset}&id_parent=${
    action.comment.idParent
  }`;

  const options = {
    method: 'PUT',
  };
  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(postCommentSucces([]));
    } else {
      const localData = response.data;
      localData.forEach((k, v) => {
        localData[v].created_at = new Date(k.created_at).toGMTString();
        localData[v].updated_at = new Date(k.updated_at).toGMTString();
      });
      yield put(
        getCommentsSucces(
          action.comment.postId,
          localData,
          action.comment.idParent,
        ),
      );
      yield put(
        changeCommentNumber(
          action.comment.postId,
          localData[0] ? localData[0].nbrComments : 0,
          action.comment.idParent,
        ),
      );
    }
  } catch (err) {
    yield put(postCommentSucces([]));
  }
}

export function* removeComment(action) {
  const requestURL = `/api/comments/${action.commentId}`;

  const options = {
    method: 'DELETE',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(removeCommentsSucces('-1'));
    } else {
      yield put(
        removeCommentsSucces(
          action.postId,
          action.commentId,
          response.data.idParent,
        ),
      );
      yield put(changeCommentNumber(action.postId, -1, response.data.idParent));
    }
  } catch (err) {
    yield put(removeCommentsSucces('-1'));
  }
}

export function* reportMemeSlideSaga(action) {
  const requestURL = `/api/posts/${action.idPost}`;

  const options = {
    method: 'PUT',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(reportMemesSlideSucces(action.idPost));
    } else {
      yield put(reportMemesSlideSucces(action.idPost));
    }
  } catch (err) {
    yield put(reportMemesSlideSucces(action.idPost));
  }
}

export default function* initPostSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_MEMES_SLIDE, loadMemesSlideSaga);
  yield takeLatest(LIKE_DISLIKE, insertLikePostUserDB);
  yield takeLatest(GET_COMMENTS, getComments);
  yield takeLatest(POST_COMMENT, postComment);
  yield takeLatest(EDIT_COMMENT, editComment);
  yield takeLatest(REMOVE_COMMENT, removeComment);
  yield takeLatest(REPORT_MEME_SLIDE, reportMemeSlideSaga);
}
