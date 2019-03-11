import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  checkUserDBSucces,
  checkUserDBError,
  checkUserDBNotFound,
} from './actions';
import { USER_LOGIN, USER_DB_NOT_FOUND } from './constants';
import { API_IP, API_PORT } from '../../utils/constants';

export function* checkUserDB(action) {
  const requestURL = `http://${API_IP}:${API_PORT}/api/users/${
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
  const requestURL = `http://${API_IP}:${API_PORT}/api/users?username=${
    action.msg.profile.email
  }&password=&email=${action.msg.profile.email}&description=&avatarurl=${
    action.msg.profile.picture
  }&age=`;

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

export default function* initAppSaga() {
  yield takeLatest(USER_LOGIN, checkUserDB);
  yield takeLatest(USER_DB_NOT_FOUND, insertUserDB);
}
