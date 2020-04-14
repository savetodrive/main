/* eslint-disable */
import React from 'react';
import renderIf from 'render-if';
import Loadable from 'react-loadable';
import startCase from 'lodash/fp/startCase';
import kebabCase from 'lodash/fp/kebabCase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Checkbox, Select, Button, Popup, Form, Input, Grid, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import autobind from 'auto-bind';
import Home from '../core/Home';
import GoogleAd from '../../components/ads/GoogleAd';
import * as actions from '../actions/Actions';
import AdsReloader from '../../components/AddReloader';
import Captcha from '../../components/Captcha';
import DescriptionSTD from '../../components/DescriptionSTD';
import UploadTable from '../containers/UploadTable';
import LoadableHome from '../containers/LoadableHome';
import CookieAlert from '../../components/CookieAlert';

// we will load Google Ads, Twitter widget and facebook widget after
// so we will get nicer experience, we will load it only after current component has been mounted

class Index extends Home {
  constructor(props) {
    super(props);
    autobind(this);
  }
  renderFilenameInput() {
    return (
      <Form.Field>
        <Input
          id="changeFilename"
          type="text"
          label={{
            color: 'blue',
            content: 'File Name',
            className: 'equal-sized-label'
          }}
          placeholder="Type desired file name"
          onChange={this.handleUploadInputs('filename')}
        />
      </Form.Field>
    );
  }

  renderEmailInput() {
    return (
      <Form.Field>
        <Input
          id="emailInput"
          type="text"
          label={{
            color: 'blue',
            content: 'Email',
            className: 'equal-sized-label'
          }}
          placeholder="Type your email here"
          value={this.state.upload.email}
          onChange={this.handleUploadInputs('email')}
        />
      </Form.Field>
    );
  }

  getServices() {
    return Object.keys(this.state.service).map((service) => ({
      key: service,
      text: startCase(service),
      value: service,
      disabled: !this.state.service[service].name
    }));
  }
  servicesFactory(service) {
    const servicesFn = () =>
      this.state.service[service].disabled ? (
        <Popup
          key={service}
          trigger={
            <a>
              <svg className="sd-icon sd-icon--blue sd-icon--large">
                <use xlinkHref={`#${kebabCase(service)}`} />
              </svg>
            </a>
          }
          hoverable
          content="This service is not available"
          size="tiny"
        />
      ) : (
        <Popup
          key={service}
          trigger={
            <a href={`/authenticate?service=${kebabCase(service)}&public=true`} title="Click to authenticate">
              {renderIf(this.isServiceAuthenticated(startCase(service)))(
                <svg className="sd-icon sd-icon--medium cloud-provider__icon-active">
                  <use xlinkHref="#check" />
                </svg>
              )}
              <svg className="sd-icon sd-icon--blue sd-icon--large">
                <use xlinkHref={`#${kebabCase(service)}`} />
              </svg>
            </a>
          }
          hoverable
          content={this.getAuthenticationMessage(startCase(service))}
          size="tiny"
        />
      );

    return servicesFn();
  }
  renderCloudProvider() {
    return (
      <div className="cloud-provider text-center">
        <div className="text-center text-white mb-3">
          Select any of your cloud storage service <br /> by clicking their logo from below.
        </div>
        {Object.keys(this.state.service).map((service) => this.servicesFactory(service))}
      </div>
    );
  }

  handleOnCookieAccept() {
    window.localStorage.setItem('std-cookie-accept', true);
    this.setState({
      isCookieAccepted: true,
    })
  }
  render() {
    return (
      <div>
        {!this.state.isCookieAccepted && <CookieAlert onAccept={this.handleOnCookieAccept} />}
        <section className="sd-intro pt-10">
          <div className="ui container">
            <h2 className="center aligned intro-header intro-header--border-bottom">Easily upload multiple files to your drive.</h2>
            {this.renderCloudProvider()}
            <Form className="mt-4" name="upload">
              <Grid centered>
                <Grid.Column mobile="16" computer="12">
                  <Form.Field>
                    <Input
                      className="round"
                      type="text"
                      value={this.state.upload.url}
                      onChange={this.handleUploadInputs('url')}
                      placeholder="Place URL here"
                      action
                    >
                      <input />
                      <Select options={this.getServices()} onChange={this.handleSetService} placeholder="Select service" />
                      <Button type="submit" color="orange" onClick={this.handleFileUpload}>
                        <Icon name="upload" />
                        Upload
                      </Button>
                    </Input>
                    <br />
                    <AdsReloader
                      status={this.state.isAds}
                      ads={() => (
                        <GoogleAd
                          type={GoogleAd.LEADER_BOARD}
                          style={{
                            marginTop: '10px',
                            marginLeft: '5%'
                          }}
                        />
                      )}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column mobile="16" tablet="10" computer="8">
                  <Form.Group>
                    <Form.Field>
                      <Checkbox
                        onClick={this.handleIsFilename}
                        checked={this.state.upload.isFilename}
                        className="mr-4"
                        label={
                          <label htmlFor="isFilename">
                            <span style={{ color: 'white' }}>Change file name</span>
                          </label>
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        onClick={this.handleIsEmail}
                        checked={this.state.upload.isEmail}
                        label={
                          <label htmlFor="isEmail">
                            <span style={{ color: 'white' }}>Mail me when upload is success/error</span>
                          </label>
                        }
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group>
                    <Form.Field style={{ marginLeft: '25%' }}>
                      <Captcha />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
                <Grid.Row>
                  <Grid.Column mobile="16" computer="8">
                    {this.state.upload.isFilename ? this.renderFilenameInput() : ''}
                    {this.state.upload.isEmail ? this.renderEmailInput() : ''}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        </section>
        <div className="bg-dark-blue">
          <Grid container>
            <Grid.Column>
              <div className="text-white text-center">
                <Icon className="mr-2" name="announcement" size="large" />
                We don&#39;t like showing Ads either, but they are our only way to maintain the server. We hope our service is worth it.
              </div>
            </Grid.Column>
          </Grid>
        </div>
        <Grid container className="mt-1 mb-2">
          <LoadableHome isAds={this.state.isAds} items={this.props.upload.items || []} />
          <Grid.Column mobile="16" computer="11">
            <AdsReloader status={this.state.isAds} ads={() => <GoogleAd type={GoogleAd.LEADER_BOARD} />} />
            {renderIf(this.props.upload.items.length)(<UploadTable items={this.props.upload.items} handleTaskKill={this.handleTaskKill} />)}
            <DescriptionSTD />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  upload: state.upload
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Index)
);
