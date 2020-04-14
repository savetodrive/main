import { postMe } from 'api/app';
import { USER_PROFILE_UPDATE_FAILED, USER_PROFILE_UPDATE_SUCCESS } from 'consts';

export function userProfileUpdateSuccess(user) {
  return {
    type: USER_PROFILE_UPDATE_SUCCESS,
    user,
  };
}

export function userProfileUpdateFailed(error) {
  return {
    type: USER_PROFILE_UPDATE_FAILED,
    error,
  };
}

export function userProfileUpdate(user) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      postMe(user).then(
        () => {
          dispatch(userProfileUpdateSuccess(user));
          return resolve(user);
        },
        (err) => {
          dispatch(userProfileUpdateFailed(err.response.data.message));
          return reject(err.response.data.message);
        },
      );
    });
}
