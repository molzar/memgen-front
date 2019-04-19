import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';

import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectUsername } from 'containers/HomePage/selectors';
import {
  loadMemesSuccess,
  updateMemeAfterLike,
  removePostSuccess,
  removePostCDNFail,
  removePostDB,
  removePostDBFail,
  reportMemesSlideSucces,
} from './actions';
import {
  LOAD_MEMES,
  LIKE_DISLIKE,
  REMOVE_POST,
  REMOVE_POST_DB,
  REPORT_MEME_SLIDE,
} from './constants';
/**
 * Github repos request/response handler
 */
export function* getRepos(action) {
  // Select username from store
  const username = yield select(makeSelectUsername());

  const requestURL = `https://api.github.com/users/${username}/repos?limit=${
    action.limit
  }&offset=${action.offset}`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* getMemes(action) {
  // Select username from store
  const requestURL = action.userID
    ? `/api/posts/${action.userID}/${action.limit}&${action.offset}`
    : `/api/posts/${action.limit}&${action.offset}`;
  const options = {
    method: 'GET',
  };

  try {
    const memes = yield call(request, requestURL, options);
    if (!memes || !memes.success || !memes.data) {
      yield put(loadMemesSuccess([]));
    } else {
      yield put(loadMemesSuccess(memes.data));
    }
  } catch (err) {
    yield put(loadMemesSuccess([]));
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

export function* removePostCDNSaga(action) {
  const requestURL = `https://api.imgur.com/3/image/${action.deletehash}`;
  const auth = 'Client-ID b728dabaeaf49a5';
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: auth,
      Accept: 'application/json',
    },
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(
        removePostCDNFail(action.indexPost, action.idPost, response.error),
      );
    } else {
      yield put(removePostDB(action.indexPost, action.idPost));
    }
  } catch (err) {
    yield put(removePostCDNFail(action.indexPost, action.idPost, err));
  }
}

export function* removePostDBSaga(action) {
  const requestURL = `/api/posts/${action.idPost}`;

  const options = {
    method: 'DELETE',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(
        removePostDBFail(action.indexPost, action.idPost, response.error),
      );
    } else {
      yield put(removePostSuccess(action.indexPost, action.idPost));
    }
  } catch (err) {
    yield put(removePostDBFail(action.indexPost, action.idPost, err));
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

export default function* initHomeSaga() {
  yield takeLatest(LOAD_REPOS, getRepos);
  yield takeLatest(LOAD_MEMES, getMemes);
  yield takeLatest(LIKE_DISLIKE, insertLikePostUserDB);
  yield takeLatest(REMOVE_POST, removePostCDNSaga);
  yield takeLatest(REMOVE_POST_DB, removePostDBSaga);
  yield takeLatest(REPORT_MEME_SLIDE, reportMemeSlideSaga);
}
