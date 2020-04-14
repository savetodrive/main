import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Grid, Card, Header, Message } from 'semantic-ui-react';
import autobind from 'auto-bind';
import { connect } from 'react-redux';
import Error from '../../components/common/Error';
import * as registerActions from '../actions/RegisterAction';
import * as loginActions from '../actions/LoginAction';
import AppLogo from '../../components/AppLogo';
import RegisterForm from '../../components/forms/RegisterForm';
import { postRegister } from '../../api/guest';
import { captchaChecker } from '../../Utils';

class Register extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false,
      toLogin: false,
      user: {},
    };
  }

  handleSubmit(user) {
    if (!captchaChecker()) {
      return false;
    }
    let toLogin = false;
    this.setState({
      loading: true,
    });
    user.captcha = window.uploadCaptchaCode; // eslint-disable-line
    return postRegister(user)
      .then(
        (request) => {
          if (request.status !== 200) {
            this.props.actions.registerError(request);
            return;
          }
          toLogin = true;
          this.props.actions.registerError([]);
          this.props.actions.registerSuccess(Object.assign({}, user, request.data));
          this.props.loginActions.userCanLogIn({
            email: user.email,
            password: user.password,
          });
        },
        (err) => {
          this.props.actions.registerError(err.response.data.message);
        },
      )
      .finally(() => {
        this.setState({
          user,
          toLogin,
          loading: false,
        });
      });
  }
  renderError(errors) {
    if (errors.length) {
      return <Error messages={errors} />;
    }
    return null;
  }

  render() {
    const {
      register: { errors },
    } = this.props;
    return (
      <Grid centered padded className="login-screen">
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Card fluid className="card mt-4">
            <Card.Content>
              <AppLogo />
            </Card.Content>

            {/* <Card.Content>
             <Segment padded>

                <Button color="facebook" fluid href="/auth/facebook">
                  Sign up via Facebook
                </Button>
                <Divider horizontal>Or</Divider>
                <Button color="google plus" fluid href="/auth/google">
                  Sign up via Google
                </Button>
              </Segment>
            </Card.Content> */}
            <Card.Content>
              {this.state.toLogin ? (
                <Message success>
                  <Message.Header>Almost done</Message.Header>
                  <Message.List>We have sent an email to {this.state.user.email}. Open it up to activate your account.</Message.List>
                </Message>
              ) : (
                <div>
                  <Header as="h3" className="mt-1">
                    Register here
                  </Header>

                  {this.renderError(errors)}
                  <RegisterForm handleSubmit={this.handleSubmit} loading={this.state.loading} />
                </div>
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

Register.propTypes = {
  loginActions: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
};

Register.contextTypes = {
  router: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  register: state.register,
});

const mapActionsToProps = (dispatch) => ({
  actions: bindActionCreators(registerActions, dispatch),
  loginActions: bindActionCreators(loginActions, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps,
  )(Register),
);
