/**
 * Gets the repositories of the user from Github
 */
import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  insertPostDB,
  insertPostDBSucces,
  insertPostDBFail,
  uploadImageFail,
  loadImageSuccess,
  loadImageFail,
} from './actions';

import { UPLOAD_IMAGE, INSERT_POST_DB, LOAD_IMAGE } from './constants';

export function* uploadImage(action) {
  const requestURL = 'https://api.imgur.com/3/image/';
  const auth = 'Client-ID b728dabaeaf49a5';
  const formData = new FormData();
  formData.append(
    'image',
    action.base64Meme.replace('data:image/png;base64,', ''),
  );
  formData.append('type', 'base64');
  formData.append('name', `MemGen_${new Date().getTime()}`);
  formData.append('title', `MemGen_${new Date().getTime()}`);

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: auth,
      Accept: 'application/json',
    },
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(uploadImageFail(response));
    } else {
      yield put(insertPostDB(response, action.profile));
    }
  } catch (err) {
    yield put(uploadImageFail(err));
  }
}

export function* insertPostDBSaga(action) {
  const requestURL = `http://localhost:3001/api/posts?url=${
    action.responsUpload.data.link
  }&id_user=${action.profile.id}`;

  const options = {
    method: 'POST',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success || !response.data) {
      yield put(insertPostDBFail(response));
    } else {
      const post = fromJS(response.data);
      yield put(insertPostDBSucces(post));
    }
  } catch (err) {
    yield put(insertPostDBFail(err));
  }
}

export function* getImageFromExternal(action) {
  const requestURL = action.image.src;

  const options = {
    method: 'GET',
    // mode: 'cors',
    headers: {
      ContentType: 'image',
      Accept: 'image',
    },
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response) {
      yield put(loadImageFail(response));
    } else {
      yield put(loadImageSuccess(response));
    }
  } catch (err) {
    yield put(loadImageFail(err));
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
  yield takeLatest(UPLOAD_IMAGE, uploadImage);
  yield takeLatest(INSERT_POST_DB, insertPostDBSaga);
  yield takeLatest(LOAD_IMAGE, getImageFromExternal);
}
