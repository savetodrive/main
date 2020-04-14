import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import startCase from 'lodash/fp/startCase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Dropdown, Button, Icon, Tabs, message, Card, Spin } from 'antd';
import ServicesList from '../../components/ServicesList';
import { popupOpener } from '../../Utils/index';
import { fetchConnections, removeConnection, pingConnection } from '../actions';
import { postRemoveConnection } from '../../api/app';
import Connection from '../../components/connections/Connection';

const { TabPane } = Tabs;

class Connections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.active = [];
    this.inactive = [];
    autobind(this);
  }

  componentWillReceiveProps() {
    this.filterByStatus();
  }

  handleMenuClick(menu) {
    popupOpener(menu.key, `../authenticate?service=${menu.key}`);
  }

  removeConnection(connection) {
    this.enableLoading();
    postRemoveConnection(connection._id)
      .then(() => {
        this.props.actions.removeConnection(connection._id);
        message.success('Connection has been removed successfully.');
      })
      .catch(() => {
        message.error('Unable to remove connection.');
      })
      .finally(() => {
        this.disableLoading();
      });
  }

  enableLoading() {
    this.setState({
      loading: true,
    });
  }
  disableLoading() {
    this.setState({ loading: false });
  }
  handleServiceInAction(connection, action) {
    return () => {
      if (action === 'delete') {
        return this.removeConnection(connection);
      }
      if (action === 'connect') {
        this.enableLoading();
        this.props.actions
          .pingConnection(connection._id)
          .then(() => {
            message.success(`Successfully connected to ${startCase(connection.service_type)} as ${connection.profile.name}`);
          })
          .catch(() => {
            popupOpener(connection.service_type, `../authenticate?service=${connection.service_type}`);
          })
          .finally(() => {
            this.disableLoading();
          });
      }
      return false;
    };
  }

  filterByStatus() {
    this.active = [];
    this.inactive = [];

    this.props.app.connections.forEach((connection) => {
      if (connection.status) {
        this.active.push(connection);
      } else {
        this.inactive.push(connection);
      }
    });
  }

  render() {
    this.filterByStatus();
    const { active, inactive } = this;
    return (
      <Card>
        <Spin spinning={this.state.loading}>
          <Row type="flex" justify="space-between" align="middle">
            <h2 style={{ display: 'inline-block' }}>Connections</h2>
            <Dropdown overlay={<ServicesList services={this.props.app.services} handleMenuClick={this.handleMenuClick} />}>
              <Button type="primary">
                <Icon type="plus" style={{ marginRight: '.5rem' }} />
                Add new connection
                <Icon type="down" style={{ marginLeft: '.5rem' }} />
              </Button>
            </Dropdown>
          </Row>
          <br />
          <Row gutter={16}>
            {!this.props.app.connections.length && (
              <Col className="gutter-row" span={6}>
                You have no connections.
              </Col>
            )}
            {this.props.app.connections.length && (
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span>All ({this.props.app.connections.length})</span>} key="1">
                  <Row gutter={16}>
                    {this.props.app.connections.map((item) => (
                      <Col className="gutter-row" span={6} key={item._id}>
                        <div className="gutter-box">
                          <Connection connection={item} handleServiceInAction={this.handleServiceInAction} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="check-circle" title="connected" />
                      Active ({active.length})
                    </span>
                  }
                  key="2"
                >
                  <Row gutter={16}>
                    {active.map((item) => (
                      <Col className="gutter-row" span={6} key={item._id}>
                        <div className="gutter-box">
                          <Connection connection={item} handleServiceInAction={this.handleServiceInAction} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="close-circle" title="Not Connected" />
                      In Active ({inactive.length})
                    </span>
                  }
                  key="3"
                >
                  <Row gutter={16}>
                    {inactive.map((item) => (
                      <Col className="gutter-row" span={6} key={item._id}>
                        <div className="gutter-box">
                          <Connection connection={item} handleServiceInAction={this.handleServiceInAction} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </TabPane>
              </Tabs>
            )}
          </Row>
        </Spin>
      </Card>
    );
  }
}

Connections.propTypes = {
  app: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  app: state.app,
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ fetchConnections, removeConnection, pingConnection }, dispatch),
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionToProps,
  )(Connections),
);
