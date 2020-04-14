import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import autobind from 'auto-bind';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Icon, Row, Col, Avatar, Dropdown, Spin } from 'antd';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import isPast from 'date-fns/is_past';
import startCase from 'lodash/fp/startCase';
import { getQueryString, firstLetters } from '../../Utils';
import { fetchServices, fetchConnections, updateConnection } from '../actions';
import { add as addTask } from '../actions/taskActions';
import { getUploadInQueue } from '../../api/app';
import PrivateRoute from '../../components/PirvateRoute';
import RemoteUpload from './RemoteUpload';
import BytesUsage from '../../components/BytesUsage';
import ConnectionsShortcut from '../containers/ConnectionsShortcut';
import Beta from '../../components/Beta';

const {
  Header, Content, Footer, Sider,
} = Layout;

const Loading = () => (
  <div
    className="center-element"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    }}
  >
    <Spin size="large" />
  </div>
);
const LoadableConnection = Loadable({
  loader: () => import('./Connection'),
  loading: Loading,
});
// const LoadableRemoteUpload = Loadable({
//   loader: () => import('./RemoteUpload'),
//   loading: Loading,
// });
const LoadableSubscribe = Loadable({
  loader: () => import('./Subscribe'),
  loading: Loading,
});
const LoadableCloudClone = Loadable({
  loader: () => import('./CloudClone'),
  loading: Loading,
});

const LoadableMe = Loadable({
  loader: () => import('./Me'),
  loading: Loading,
});

const LoadableSubscription = Loadable({
  loader: () => import('./Subscription'),
  loading: Loading,
});

const LoadableUploads = Loadable({
  loader: () => import('./Uploads'),
  loading: Loading,
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingUploads: false,
      collapsed: false,
    };
    autobind(this);
  }

  componentDidMount() {
    this.listenCloudAuthenticationPopup();
    this.props.actions.fetchServices();
    this.props.actions.fetchConnections();
    this.loadInQueueUploads();
  }
  componentWillUpdate(nextProps) {
    this.getSubbscriptionCheck(nextProps);
  }
  getSubbscriptionCheck(props) {
    if (props.user && Object.keys(props.user.subscription).length) {
      if (props.location.pathname === '/subscribe') {
        return null;
      }
      if (!props.user.subscription.active) {
        return this.props.history.push('/subscribe');
      }
    }
    return null;
  }
  getProfileMenu() {
    return (
      <Menu>
        {!this.shouldDisableMenus() && (
          <Menu.Item>
            <Link to="/me" className="item">
              <span> Profile</span>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item>
          <a href="/api/logout">Log Out</a>
        </Menu.Item>
      </Menu>
    );
  }

  getDefaultKey() {
    return {};
  }

  isNotSubscribed(user = {}) {
    return user.subscription && isPast(user.subscription.ends_at);
  }
  loadInQueueUploads() {
    this.setState({
      isLoadingUploads: true,
    });
    getUploadInQueue()
      .then(({ data = [] }) => {
        if (data && data.length) {
          // Successfull upload valdiation and process
          data.completed = null; // eslint-disable-line
          const tasks = data.map((item) => ({
            ...item,
            completed: null,
            waiting: true,
          }));
          tasks[0].waiting = false;
          this.props.actions.addTask(tasks);
        }
      })
      .finally(() => {
        this.setState({
          isLoadingUploads: false,
        });
      });
  }
  listenCloudAuthenticationPopup() {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type !== 'CLOSE') {
          return false;
        }

        let connection = getQueryString('connection', event.data.query);
        connection = JSON.parse(decodeURIComponent(connection));
        connection.status = true;
        this.props.actions.updateConnection(connection._id, connection);
        event.source.close();
        return true;
      },
      false,
    );
  }
  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  shouldDisableMenus() {
    const { user } = this.props;
    return user && !user.subscription.active;
  }
  parsePathnameToSimpleTitleBar(pathname) {
    return startCase((pathname || '').split('/').pop());
  }
  render() {
    const { pathname } = this.props.location;
    const { user } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Helmet>
          <title>{this.parsePathnameToSimpleTitleBar(pathname)}</title>
        </Helmet>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Link to="/" className="item">
            <div className="logo">
              <Beta>
                <img src="/images/std_logo_small.png" alt="Savetodrive" width="100%" />
              </Beta>
            </div>
          </Link>
          <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline" style={{ display: this.shouldDisableMenus() ? 'none' : 'block' }}>
            <Menu.Item key="/remote-upload">
              <Link to="/remote-upload" className="item">
                <Icon type="cloud-upload-o" />
                <Beta>Remote Upload</Beta>
              </Link>
            </Menu.Item>
            <Menu.Item key="/connections">
              <Link to="/connections" className="item">
                <Icon type="link" />
                <span> Connections</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/cloud-clone">
              <Link to="/cloud-clone" className="item">
                <Icon type="right-square-o" />
                <Beta>Cloud Clone</Beta>
              </Link>
            </Menu.Item>
            <Menu.Item key="/uploads">
              <Link to="/uploads" className="item">
                <Icon type="upload" />
                <span> Uploads</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row type="flex" justify="space-between">
              <Col span={2}>
                <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
              </Col>
              <Col span={7} />
              <Col span={10}>
                <BytesUsage user={user} />
              </Col>
              <Col span={1}>
                <ConnectionsShortcut />
              </Col>
              <Col span={4}>
                <Dropdown overlay={this.getProfileMenu()}>
                  <span className="ant-dropdown-link">
                    <Avatar style={{ backgroundColor: '#F2711D' }}>{firstLetters(`${user.first_name} ${user.last_name}`)}</Avatar>{' '}
                    {startCase(user.first_name)}
                    <Icon type="caret-down" style={{ fontSize: '.5rem', marginLeft: '.5rem', verticalAlign: 'middle' }} />
                  </span>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: '1rem' }}>
            <Switch>
              <Route path="/me" component={LoadableMe} />
              <Route path="/subscribe" component={LoadableSubscribe} />
              <PrivateRoute user={user} path="/connections" component={LoadableConnection} />
              <PrivateRoute user={user} isLoadingUploads={this.state.isLoadingUploads} path="/remote-upload" component={RemoteUpload} />
              <PrivateRoute user={user} path="/subscription" component={LoadableSubscription} />
              <PrivateRoute user={user} path="/uploads" component={LoadableUploads} />
              <PrivateRoute user={user} path="/cloud-clone" component={LoadableCloudClone} />
              <PrivateRoute isLoadingUploads={this.state.isLoadingUploads} user={user} exact path="/" component={RemoteUpload} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }} />
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.app.user,
  drives: state.app.drives,
});

function mapActionsToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        fetchConnections,
        fetchServices,
        updateConnection,
        addTask,
      },
      dispatch,
    ),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps,
  )(App),
);
