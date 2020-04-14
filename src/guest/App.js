import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import AppFooter from '../components/common/Footer';
import NavBar from '../guest/containers/NavBar';
import PAGE404 from '../components/404';
import PageLoading from './containers/PageLoading';
import { getMe } from '../api/app';

// import Home from './pages/Home';

/* prettier-ignore */
// We will not code split home page
const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: PageLoading,
});
const Login = Loadable({
  loader: () => import('./pages/Login'),
  loading: PageLoading,
});
const RegisterPage = Loadable({
  loader: () => import('./pages/Register'),
  loading: PageLoading,
});
const ForgotPassword = Loadable({
  loader: () => import('./pages/ForgotPassword'),
  loading: PageLoading,
});
const CreatePassword = Loadable({
  loader: () => import('./pages/CreatePassword'),
  loading: PageLoading,
});

const ResetPassword = Loadable({
  loader: () => import('./pages/ResetPassword'),
  loading: PageLoading,
});
const Pricing = Loadable({
  loader: () => import('./pages/Pricing'),
  loading: PageLoading,
});
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount() {
    this.fetchUser();
  }

  redirectUser() {
    const { props, state } = this;
    if (state.user && props.location) {
      window.location.href = '/app';
    }
  }

  fetchUser() {
    getMe().then(({ data }) => {
      this.setState({ user: data }, () => {
        this.redirectUser();
      });
    });
  }
  render() {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/new-password" component={ResetPassword} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/create-password/:service" component={CreatePassword} />
          <Route component={PAGE404} />
        </Switch>
        <AppFooter />
      </div>
    );
  }
}

App.propTypes = {};

export default withRouter(App);
