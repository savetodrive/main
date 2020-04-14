import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/';

const isProd = process.env.NODE_ENV === 'production';
const middleware = [];
const composed = [];
middleware.push(thunk);
if (!isProd) {
  middleware.push(reduxImmutableStateInvariant());
  const loggerMiddleware = createLogger({
    predicate: () => !isProd,
  });
  middleware.push(loggerMiddleware);
}

composed.push(applyMiddleware(...middleware));
if (!isProd) {
  composed.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}
export default function configureStore(initialState) {
  const devCreateStore = compose(...composed)(createStore);

  return devCreateStore(rootReducer, initialState);
}
