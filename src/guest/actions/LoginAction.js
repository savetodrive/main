import {
  USER_CAN_LOG_IN,
  USER_LOG_IN_FAILED,
  USER_LOG_IN_SUCCESS,
  RESET_FIELD,
} from 'consts';


export function loginSuccess({ user, token }) {
  return {
    type: USER_LOG_IN_SUCCESS,
    user,
    token,
  };
}

export function loginFailed(error) {
  return {
    type: USER_LOG_IN_FAILED,
    errors: error,
  };
}

export function resetFields() {
  return {
    type: RESET_FIELD,
  };
}

export function userCanLogIn(user) {
  return {
    type: USER_CAN_LOG_IN,
    user,
  };
}
