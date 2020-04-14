import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Card } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import LoginForm from '../../components/forms/LoginForm';
import * as loginActions from '../actions/LoginAction';
import Error from '../../components/common/Error';
import AppLogo from '../../components/AppLogo';
import toast from '../../Utils/Toast';
import { captchaChecker } from '../../Utils';
import { postLogin } from '../../api/guest';

class Login extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false,
    };
  }
  componentWillUnmount() {
    this.props.actions.resetFields();
  }
  handleSubmit({ email, password }) {
    if (!captchaChecker()) {
      return false;
    }
    this.setState({
      loading: true,
    });
    return postLogin({
      username: email,
      captcha: window.uploadCaptchaCode,
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
          return this.props.actions.loginSuccess({ user: { email, password }, token: response.data.token });
        },
        (err) => this.props.actions.loginFailed(err.response.data.message),
      )
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  renderError(errors) {
    if (errors && errors.length) {
      return <Error messages={errors} />;
    }

    return null;
  }

  render() {
    const {
      login: { errors },
    } = this.props;
    return (
      <Grid centered padded className="login-screen">
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Card fluid className="card mt-4">
            <Card.Content>
              <AppLogo />
            </Card.Content>
            <Card.Content>
              {this.renderError(errors)}
              <LoginForm
                email={this.props.login.email}
                password={this.props.login.user.password}
                handleSubmit={this.handleSubmit}
                loading={this.state.loading}
              />
            </Card.Content>
          </Card>

          <div className="text-center text-white small mt-6">
            Dont have an account?
            <Link to="/register" className="text-danger">
              {' '}
              Sign up
            </Link>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

Login.propTypes = {
  actions: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  login: state.login,
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch),
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps,
  )(Login),
);
