import React from 'react';
import { render } from 'react-dom';
import 'pace-progress/themes/blue/pace-theme-minimal.css';
import 'semantic-ui-css/semantic.min.css';
import 'babel-polyfill';
import { AppContainer } from 'react-hot-loader';
import '../../public/styles/react-redux-toastr.min.css';
import '../styles/scss/style.scss';
import '../styles/styles.css';
// import pace from '../../public/js/libs/Pace';
import { getToken } from '../Utils/Token';
import App from './pages/App';

(function anonymous() {
  // pace.start();
  window.Savetodrive = {};
  window.Savetodrive.getToken = getToken;

  const renderApp = (Children) => {
    render(
      <AppContainer>
        <Children />
      </AppContainer>,
      document.getElementById('app'),
    );
  };
  renderApp(App);

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
      renderApp(App);
    });
  }
}());
