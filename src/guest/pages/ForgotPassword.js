import React from 'react';
import { Redirect } from 'react-router-dom';
import autobind from 'auto-bind';
import { Grid, Card } from 'semantic-ui-react';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import AppLogo from '../../components/AppLogo';
import { postForgotPassword } from '../../api/guest';
import toast from '../../Utils/Toast';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      toLogin: false,
      loading: false,
      email: '',
    };
  }

  resetEmail() {
    this.setState({
      email: '',
    });
  }
  handleSubmit(values) {
    let toLogin = false;
    this.setState({
      loading: true,
    });
    return postForgotPassword({ email: values.email })
      .then(() => {
        toLogin = true;
        toast('New password reset link has been sent your through email');
      })
      .catch((error) => {
        toast(error.response.data.message, 'error');
      })
      .finally(() => {
        this.setState({
          loading: false,
          toLogin,
        });
      });
  }
  render() {
    return (
      <div className="login-screen pt-10">
        {this.state.toLogin && <Redirect to="/login" />}
        <Grid centered padded>
          <Grid.Column computer={6} tablet={8} mobile={16}>
            <Card fluid>
              <Card.Content>
                <AppLogo />
              </Card.Content>
              <Card.Content>
                <Card.Header className="text-center">Forgot Password?</Card.Header>
                <ForgotPasswordForm email={this.state.email} handleSubmit={this.handleSubmit} loading={this.state.loading} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

ForgotPassword.propTypes = {};

export default ForgotPassword;
