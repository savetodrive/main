import { combineReducers } from 'redux';
// import { reducer as formReducer } from 'redux-form';
import register from './RegisterReducer';
import login from './LoginReducer';
import upload from './UploadReducer';

const rootReducer = combineReducers({
  upload,
  register,
  login,
  // form: formReducer,
});

export default rootReducer;
