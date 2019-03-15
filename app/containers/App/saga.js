import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { fromJS } from 'immutable';
import {
  checkUserDBSucces,
  checkUserDBError,
  checkUserDBNotFound,
  updateGridProps,
  updateGridPropsError,
} from './actions';
import { USER_LOGIN, USER_DB_NOT_FOUND, FIND_PAGES } from './constants';
import Config from '../../../server/conf/config';

export function* checkUserDB(action) {
  const requestURL = `http://${Config.apiHost}:${Config.apiPort}/api/users/${
    action.profile.email
  }`;
  const options = {
    method: 'GET',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success || !response.data) {
      yield put(checkUserDBNotFound(action));
    } else {
      yield put(checkUserDBSucces(response.data));
    }
  } catch (err) {
    yield put(checkUserDBError(err));
  }
}

export function* insertUserDB(action) {
  const requestURL = `http://${Config.apiHost}:${
    Config.apiPort
  }/api/users?username=${action.msg.profile.email}&password=&email=${
    action.msg.profile.email
  }&description=&avatarurl=${action.msg.profile.picture}&age=`;

  const options = {
    method: 'POST',
  };

  try {
    const response = yield call(request, requestURL, options);
    if (!response || !response.success) {
      yield put(checkUserDBError(response));
    } else {
      yield put(checkUserDBSucces(response.data));
    }
  } catch (err) {
    yield put(checkUserDBError(err));
  }
}

export function* findPages(action) {
  const requestURL = `http://${Config.apiHost}:${
    Config.apiPort
  }/api/posts/get/count/all`;

  const options = {
    method: 'GET',
  };

  try {
    const response = yield call(request, requestURL, options);
    const newGridPros = action.gridProps;
    if (!response || !response.success) {
      newGridPros.pages = 1;
      yield put(updateGridProps(fromJS(newGridPros)));
    } else {
      newGridPros.pages = Math.round(response.data / newGridPros.offset);
      yield put(updateGridProps(fromJS(newGridPros)));
    }
  } catch (err) {
    yield put(updateGridPropsError(err));
  }
}

export default function* initAppSaga() {
  yield takeLatest(USER_LOGIN, checkUserDB);
  yield takeLatest(USER_DB_NOT_FOUND, insertUserDB);
  yield takeLatest(FIND_PAGES, findPages);
}
