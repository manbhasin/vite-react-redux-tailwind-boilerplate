import { SAGA_PAYLOAD_TYPE } from 'models/types/SagaPayloadType';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AuthActionType } from 'redux/actions/actions.constants';
import {
  authFetchMeCompletedAction,
  authFetchMeErrorAction,
  AuthLoginActionPayloadType,
  authLoginCompletedAction,
  authLoginErrorAction,
} from 'redux/actions/auth.action';
import { authService } from 'services/api-services/AuthService';
import { localStorageService } from 'services/LocalStorageService';

interface LoginSagaPayloadType extends SAGA_PAYLOAD_TYPE {
  payload: AuthLoginActionPayloadType;
}

function* loginSaga(data: LoginSagaPayloadType): any {
  try {
    const response = yield call(authService.login, data.payload);
    yield put(authLoginCompletedAction(response.user));
    localStorageService.setAuthToken(response?.token?.token);
  } catch (e: any) {
    yield put(
      authLoginErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

function* fetchLoggedInUserSaga(): any {
  try {
    const response = yield call(authService.fetchMe);
    yield put(authFetchMeCompletedAction(response.user));
  } catch (e: any) {
    localStorageService.removeAuthToken();
    yield put(authFetchMeErrorAction(e?.message));
  }
}

function* authSaga() {
  yield all([
    takeLatest(AuthActionType.LOGIN, loginSaga),
    takeLatest(AuthActionType.FETCH_ME, fetchLoggedInUserSaga),
  ]);
}

export default authSaga;
