/* global Raven */
/* eslint-disable global-reqiure */
import 'babel-polyfill';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import 'semantic-ui-css/semantic.min.css';
import 'toasteo/dist/css/toasteo.css';
import Toasteo from 'toasteo';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import './styles/scss/style.scss';
import './styles/styles.css';
import configureStore from './guest/store/configureStore';
import AppRoutes from './guest/App';
import subscriber from './subscriber/guest';
import Socket from './Utils/Socket';
import GuestSocketListeners from './guest/core/GuestSocketListeners';
import FeatureFlag from './components/FeatureFlag';

window.NProgress = NProgress;
FeatureFlag.init();

(function anonymous() {
  if (window.Raven) {
    Raven.config('https://8a690c6281e0498281932ad1f3bcb030@sentry.io/250605').install();
  }
  window.uploadCaptchaCode = null;
  window.handleUploadCaptcha = function handleUploadCaptcha(code) {
    window.uploadCaptchaCode = code;
  };
  window.handleCaptchaExpired = function handleUploadCaptcha() {
    window.uploadCaptchaCode = null;
  };
  window.toasteo = new Toasteo();
  const store = configureStore();
  subscriber(store);
  const socket = new Socket();
  const guestListener = new GuestSocketListeners(socket, store);
  guestListener.mapEventsToHandlers();
  guestListener.listen();
  const renderApp = (Routes) => {
    render(
      <AppContainer>
        <Provider store={store}>
          <BrowserRouter store={store}>
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
    module.hot.accept('./guest/App', () => {
      const newRoutes = require('./guest/App').default; // eslint-disable-line
      renderApp(newRoutes);
      return true;
    });
  }
}());
