import {
  USER_CAN_LOG_IN,
  RESET_FIELD,
  USER_LOG_IN_FAILED,
  USER_LOG_IN_SUCCESS,
} from 'consts';

const initialState = {
  user: {
    email: '',
    password: '',
  },
  errors: [],
  status: false,
  token: false,
};

export default function loginReducer(state = initialState, action) {
  let alterState = {};

  switch (action.type) {
    case USER_LOG_IN_FAILED:
      alterState = {
        user: initialState.user,
        errors: action.errors,
        status: false,
        token: false,
      };
      break;
    case USER_LOG_IN_SUCCESS:
      alterState = {
        errors: [], user: action.user, status: true, token: action.token,
      };
      break;

    case RESET_FIELD:
      alterState = {
        errors: [], user: initialState.user, status: false, token: false,
      };
      break;
    case USER_CAN_LOG_IN:
      alterState = { user: action.user };
      break;
    default:
      alterState = {};
      break;
  }
  return Object.assign({}, state, alterState);
}
