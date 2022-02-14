import produce from 'immer';
import { Reducer } from 'redux';
import { AuthActionType } from 'redux/actions/actions.constants';

export interface AuthState {
  userID?: number;
  loading?: boolean;
  error?: string;
}

const initialState: AuthState = {};

export const authReducer: Reducer<AuthState> = (
  state = initialState,
  action: any
) =>
  produce(state, (draft: AuthState) => {
    switch (action.type) {
      case AuthActionType.LOGIN:
      case AuthActionType.FETCH_ME: {
        draft.loading = true;
        break;
      }
      case AuthActionType.LOGIN_COMPLETED:
      case AuthActionType.FETCH_ME_COMPLETED: {
        draft.userID = action.payload.id;
        draft.loading = false;
        draft.error = undefined;
        break;
      }
      case AuthActionType.LOGIN_ERROR:
      case AuthActionType.FETCH_ME_ERROR: {
        draft.loading = false;
        draft.error = action.payload;
        break;
      }
      default:
        break;
    }
  });
