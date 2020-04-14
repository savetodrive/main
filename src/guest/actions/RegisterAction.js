import { CREATE_USER_FAILED, CREATE_USER_SUCCESS } from 'consts';

export function registerSuccess(user) {
  return {
    type: CREATE_USER_SUCCESS,
    user,
  };
}

export function registerError(errors) {
  return {
    type: CREATE_USER_FAILED,
    errors,
  };
}
