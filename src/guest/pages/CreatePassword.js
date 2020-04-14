import React from 'react';
import PropTypes from 'prop-types';
import { getQueryString } from 'utils';
import { connect } from 'react-redux';
import autobind from 'auto-bind';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Grid, Card } from 'semantic-ui-react';
import { postAuthCallback, postLogin } from '../../api/guest';
import toast from '../../Utils/Toast';
import CreatePasswordForm from '../../components/forms/CreatePasswordForm';
import AppLogo from '../../components/AppLogo';
import * as loginActions from '../actions/LoginAction';

class CreatePassword extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    if (!getQueryString('code')) {
      window.location.href = '/register';
    }
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
          window.location.href = '/app';
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
    const { service } = this.props.match.params;
    return postAuthCallback({
      service,
      payload: { password: values.password },
      params: { code: getQueryString('code') },
    })
      .then(() => {
        toast('You have been logged in.');
        window.location.href = '/app';
      })
      .catch(({ response }) => {
        toast(response.data.message || 'An error occurred.', 'error');
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
              <CreatePasswordForm handleSubmit={this.handleSubmit} loading={this.state.loading} />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

CreatePassword.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch),
});
export default withRouter(
  connect(
    null,
    mapActionsToProps,
  )(CreatePassword),
);
