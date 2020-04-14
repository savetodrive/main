import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
// import '../styles/scss/style.scss';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import '../styles/app.less';
import '../styles/app.css';
import appStore from './stores/appStore';
import * as Action from './actions/index';
import { updateEmail } from './actions/UploadActions';
import { LOGIN_PATH } from '../consts';
import AppRoutes from './pages/App';
import SocketWorkerHandler from './core/SocketWorkerHandler';

require('es6-promise').polyfill();
require('promise.prototype.finally').shim();

window.NProgress = NProgress;

(function anonymous() {
  const store = appStore();
  const socketHandler = new SocketWorkerHandler(store);
  socketHandler.listen();

  const renderApp = (Routes) => {
    render(
      <AppContainer>
        <Provider store={store}>
          <BrowserRouter store={store} basename="/app">
            <Routes />
          </BrowserRouter>
        </Provider>
      </AppContainer>,
      document.getElementById('app'),
    );
  };
  renderApp(AppRoutes);
  if (module.hot) {
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => {
      // eslint-disable-line no-console
      if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
        // React route changed
      } else {
        // Log the error as normally
        orgError.apply(console, args);
      }
    };
    module.hot.accept('./pages/App', () => {
      const newRoutes = require('./pages/App').default; // eslint-disable-line
      renderApp(newRoutes);
    });
  }
  store.dispatch(Action.auth()).then(
    (user) => {
      store.dispatch(Action.fetchUserDetailsSuccess(user));
      store.dispatch(updateEmail(user.email));
    },
    () => {
      window.location.href = LOGIN_PATH;
      return false;
    },
  );
}());
