import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import autobind from 'auto-bind';
import { postNewPassword, postLogin } from '../../api/guest';
import { getQueryString } from '../../Utils';
import AppLogo from '../../components/AppLogo';
import toast from '../../Utils/Toast';
import * as loginActions from '../actions/LoginAction';
import ResetPasswordForm from '../../components/forms/CreatePasswordForm';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false,
    };
  }
  login({ email, password }) {
    postLogin({
      username: email,
      password,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            return this.props.actions.loginFailed(response.data);
          }

          toast('You have been logged in.');
          setTimeout(() => {
            window.location.href = '/app';
          }, 1000);
          return this.props.actions.loginSuccess({
            user: { email, password },
            token: response.data.token,
          });
        },
        (err) => this.props.actions.loginFailed(err.response.data.message),
      )
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  handleSubmit(values) {
    this.setState({
      loading: true,
    });
    return postNewPassword({ hash: getQueryString('token') }, { password: values.password })
      .then(() => {
        toast('You have been logged in.');
        window.location.href = '/app';
      })
      .catch((err) => toast(err.response.data.message, 'error'))
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  render() {
    return (
      <Grid centered padded className="login-screen">
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Card fluid className="card mt-4">
            <Card.Content>
              <AppLogo />
            </Card.Content>
            <Card.Content>
              <ResetPasswordForm handleSubmit={this.handleSubmit} loading={this.state.loading} />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

ResetPassword.propTypes = {
  actions: PropTypes.object.isRequired,
};

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch),
});
export default withRouter(
  connect(
    null,
    mapActionsToProps,
  )(ResetPassword),
);
