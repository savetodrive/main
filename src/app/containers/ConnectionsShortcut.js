import startCase from 'lodash/fp/startCase';
import autobind from 'auto-bind';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Avatar, Menu, Dropdown, Button, Icon, message } from 'antd';
import { popupOpener, limitString } from '../../Utils/index';
import { pingConnection } from '../actions';

class ConnectionsShortcut extends React.Component {
  constructor() {
    super();
    autobind(this);
  }
  handleServiceInAction(connection) {
    return () => {
      this.props.actions
        .pingConnection(connection._id)
        .then(() => {
          message.success(`Successfully connected to ${startCase(connection.service_type)} as ${connection.profile.name}`);
        })
        .catch(() => {
          popupOpener(connection.service_type, `../authenticate?service=${connection.service_type}`);
        });
    };
  }
  render() {
    const { connections } = this.props;
    const menu = (
      <Menu>
        {connections.map((connection) => (
          <Menu.Item key={connection._id}>
            <Row>
              <Col span={2}>
                <Avatar style={{ paddingRight: '10px' }} size="small" src={`../images/clouds/${connection.service_type}.svg`} />
              </Col>
              <Col span={16}>{limitString(connection.profile.email, 15)}</Col>
              <Col span={2}>
                {connection.status ? (
                  <Icon type="check-circle" title="connected" style={{ color: 'green' }} />
                ) : (
                  <Icon type="close-circle" title="Not Connected" style={{ color: 'red' }} />
                )}
              </Col>
              <Col span={2}>
                <Button shape="circle" icon="sync" title="Connect" onClick={this.handleServiceInAction(connection)} />
              </Col>
            </Row>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown trigger={['click']} overlay={menu} placement="bottomLeft">
        <Button shape="circle" icon="link" />
      </Dropdown>
    );
  }
}
ConnectionsShortcut.propTypes = {
  connections: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  connections: state.app.connections,
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ pingConnection }, dispatch),
});
export default connect(
  mapStateToProps,
  mapActionToProps,
)(ConnectionsShortcut);
