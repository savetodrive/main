import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/fp/kebabCase';
import autobind from 'auto-bind';
// import startCase from 'lodash/fp/startCase';
import dotProp from 'dot-prop-immutable';
import Scroller from 'react-scroll';
import { getServiceStatus, getPingApp } from '../../api/guest';
import FeatureFlag from '../../components/FeatureFlag';
import { captchaChecker } from '../../Utils';
import toastr from '../../Utils/Toast';

const { scroller } = Scroller;
const UPLOAD = {
  service: null,
  url: '',
  isEmail: false,
  isFilename: false,
  email: '',
  filename: false,
};

class Home extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.newClouds = (process.env.FEATURE_CLOUDS || '').split(',') || [];
    this.state = {
      isCookieAccepted: false,
      lazyLoadOther: false,
      isAds: true,
      isUploading: false,
      upload: Object.assign({}, UPLOAD),
      isFeatureEnabled: FeatureFlag.IS_FEATURE,
      service: {
        googleDrive: {},
        box: {},
        dropbox: {},
        pcloud: {
          disabled: true,
        },
        yandexDisk: { disabled: true },
        // vimeo: { disabled: true },
        youtube: { disabled: true },
        dailymotion: { disabled: true },
        // twitch: {},
      },
    };
    this.handleIsEmail = this.handleIsEmail.bind(this);
    this.handleIsFilename = this.handleIsFilename.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleTaskKill = this.handleTaskKill.bind(this);
    this.getAuthenticationMessage = this.getAuthenticationMessage.bind(this);
    this.handleSetService = this.handleSetService.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.setState({
      isFeatureEnabled: FeatureFlag.isFeature(),
    });
  }
  componentDidMount() {
    this.pingService();
    this.init();
  }
  getAuthenticationMessage(service) {
    const name = this.isServiceAuthenticated(service);

    if (name) {
      return `You are connected on ${service} as ${name}`;
    }

    return `${service}: Please click service to authenticate.`;
  }
  init() {
    this.setState({
      isCookieAccepted: !!window.localStorage.getItem('std-cookie-accept'),
      lazyLoadOther: true,
    });
  }
  /* eslint-disable */
  isServiceAuthenticated(service) {
    let name = null;
    switch (service) {
      case 'Google Drive':
        name = this.state.service.googleDrive.name;
        break;
      case 'Box':
        name = this.state.service.box.name;
        break;
      case 'Dropbox':
        name = this.state.service.dropbox.name;
        break;
      case 'Pcloud':
        name = this.state.service.pcloud.name;
        break;
      case 'Youtube':
        name = this.state.service.youtube.name;
        break;
      case 'Yandex Disk':
        name = this.state.service.yandexDisk.name;
        break;
      case 'Vimeo':
        name = this.state.service.vimeo.name;
        break;
      case 'Dailymotion':
        name = this.state.service.dailymotion.name;
        break;
      case 'Twitch':
        name = this.state.service.twitch.name;
        break;
      default:
        return 'Not available';
    }
    return name;
  }
  /* eslint-enable */

  handleSetService(proxy, option) {
    this.setState({
      ...this.state,
      upload: {
        ...this.state.upload,
        service: option.value,
      },
    });
  }

  handleFileUpload(event) {
    event.preventDefault();
    if (window.isAdsBlocked === true) {
      return toastr(
        'Please consider supporting us' +
          ' by disabling your ad blocker or whitelisting us. ' +
          'You can also help us by Donating any amount of your choice.',
        'error',
      );
    }
    if (!captchaChecker()) {
      return false;
    }
    if (this.state.isUploading) {
      return toastr('Another task is in process please wait...', 'error');
    }
    if (!this.state.upload.service) {
      toastr('Please select any service to upload.', 'error');
      return toastr("Authenticate to service by clicking on service's logo.");
    }

    if (this.state.upload.isEmail && !this.state.upload.email) {
      return toastr('Please fill email address if you want to get notified.', 'error');
    }

    if (this.state.upload.isFilename && !this.state.upload.filename) {
      return toastr('Please fill filename if you want to change filename.', 'error');
    }

    if (!this.state.upload.url) {
      return toastr('Please provide url to upload.', 'error');
    }

    toastr('Uploading file..', 'success');
    const { upload } = this.state;
    const data = {
      url: encodeURIComponent(this.state.upload.url),
    };

    if (upload.isFilename) {
      data.isFilename = this.state.upload.isFilename;
      data.filename = this.state.upload.filename;
    }

    if (upload.isEmail) {
      data.email = this.state.upload.email;
      data.isEmail = this.state.upload.isEmail;
    }
    this.setState({
      ...this.state,
      isUploading: true,
    });
    data.captcha = window.uploadCaptchaCode;
    this.props.actions
      .uploadFile({ service: kebabCase(this.state.upload.service), data })
      .then((response) => {
        if (response) {
          this.setState({
            ...this.state,
            upload: Object.assign({}, UPLOAD, {
              service: this.state.upload.service,
              email: this.state.upload.email,
            }),
          });
          scroller.scrollTo(response.uuid, {
            duration: 1500,
            delay: 80,
            smooth: true,
            offset: -100, // Scrolls to element + 50 pixels down the page
          });
        }
      })
      .catch(console.log)
      .finally(() => {
        this.setState({
          ...this.state,
          isUploading: false,
        });
      });
    return false;
  }

  handleIsFilename() {
    this.setState(
      {
        upload: {
          ...this.state.upload,
          isFilename: !this.state.upload.isFilename,
        },
      },
      () => {
        const input = document.getElementById('changeFilename');
        if (input) {
          input.focus();
        }
      },
    );
  }

  handleIsEmail() {
    this.setState({ upload: { ...this.state.upload, isEmail: !this.state.upload.isEmail } }, () => {
      const input = document.getElementById('emailInput');
      if (input) {
        input.focus();
      }
    });
  }

  /* eslint-disable */
  handleTaskKill(item, index) {
    return () => {
      // if (item.completed === null) {
      //   return toastr.confirm('Kill Task', 'Do you want to Stop this task', () => {
      //       return this.props.actions.killUploadingTask(item.uuid);
      //     },
      //     () => true);
      // }
      if (confirm('Do you want to close this item?')) {
        this.props.actions.lockProgress();
        this.props.actions.removeTaskFromIndex(item.uuid);
        this.props.actions.removeUploadedTask(item.uuid, index);
        this.props.actions.reindexItems();
        this.props.actions.unlockProgress();
      }
    };
  }

  handleUploadInputs(key) {
    return (event) =>
      this.setState({
        upload: {
          ...this.state.upload,
          [key]: event.target.value,
        },
      });
  }

  pingService() {
    getPingApp()
      .then(() => {
        Object.keys(this.state.service).forEach((service) => {
          if (this.state.service[service].disabled) return;
          return getServiceStatus(kebabCase(service))
            .then((response) => {
              const state = dotProp.set(this.state, 'upload.email', response.data.email);
              state.service[service] = { ...state.service[service], ...response.data };
              console.log(state.service[service]);
              this.setState(state);
            })
            .catch(() => {
              // toastr.error(`You are not connected to ${startCase(service)}.`);
            });
        });
      })
      .catch(() => {
        message.error('We are unable to connect to our server.');
      });
  }
}

Home.propTypes = {
  actions: PropTypes.object.isRequired,
};
export default Home;
