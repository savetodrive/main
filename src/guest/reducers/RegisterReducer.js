import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILED,
  CREATE_USER_LOADING,
} from 'consts';

const initialState = {
  user: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  },
  isLoading: false,
  status: false,
  errors: [],
  toastr: {
    message: '',
    type: 'success',
  },
};

export default function registerReducer(state = initialState, action) {
  let alterState = {};

  switch (action.type) {
    case CREATE_USER_SUCCESS:
      alterState = { status: true, user: action.user };
      break;
    case CREATE_USER_FAILED:
      alterState = { status: false, errors: action.errors };
      break;
    case CREATE_USER_LOADING:
      alterState = {};
      break;

    default:
      alterState = {};
      break;
  }
  return Object.assign({}, state, alterState);
}
