import { userProfileUpdateSuccess, userProfileUpdateFailed } from 'app/actions/MeActions';
import { postMe } from 'api/app';


export function userProfileUpdate(user) {
  return dispatch => (
    new Promise((resolve, reject) => {
      postMe(user)
        .then(() => {
          dispatch(userProfileUpdateSuccess(user));
          return resolve(user);
        }, (err) => {
          dispatch(userProfileUpdateFailed(err.response.data.message));
          return reject(err.response.data.message);
        });
    })
  );
}
