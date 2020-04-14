import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from '../reducers/';

export default function configureStore(initialState) {
  const args = [applyMiddleware(reduxImmutableStateInvariant(), thunk)];
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    args.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const devCreateStore = compose(...args)(createStore);

  return devCreateStore(rootReducer, initialState);
}
