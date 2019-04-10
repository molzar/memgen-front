import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';

import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectUsername } from 'containers/HomePage/selectors';
import { loadMemesSuccess, updateMemeAfterLike } from './actions';
import { LOAD_MEMES, LIKE_DISLIKE } from './constants';
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

/**
 * Root saga manages watcher lifecycle
 */
export default function* initHomeSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_REPOS, getRepos);
  yield takeLatest(LOAD_MEMES, getMemes);
  yield takeLatest(LIKE_DISLIKE, insertLikePostUserDB);
}
