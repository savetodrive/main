import { combineReducers } from 'redux';
import app from '../reducers/app';
import upload from '../reducers/upload';
import task from '../reducers/task';
import mover from '../reducers/mover';

const rootReducer = combineReducers({
  app,
  task,
  upload,
  mover,
});

export default rootReducer;
