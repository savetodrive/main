import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card } from 'antd';

const profileSettingLinks = [
  {
    title: 'Profile',
    link: '/me',
  },
  {
    title: 'Subscription',
    link: '/subscription',
  },
];
const Settings = ({ children }) => (
  <Row gutter={24}>
    <Col span={6}>
      <Card>
        <h2 style={{ fontWeight: 'bold' }}>Settings</h2>
        <List
          itemLayout="horizontal"
          dataSource={profileSettingLinks}
          renderItem={(item) => (
            <List.Item>
              <Link to={item.link} style={{ color: '#9b9b9b' }}>
                {item.title}
              </Link>
            </List.Item>
          )}
        />
      </Card>
    </Col>
    <Col span={18}>{children}</Col>
  </Row>
);

Settings.propTypes = {
  children: PropTypes.element.isRequired,
};
export default Settings;
