import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const ServicesList = ({ handleMenuClick, services }) => (
  <Menu onClick={handleMenuClick}>
    {services.map((service) => (
      <Menu.Item key={service.id}>
        <img src={`../images/clouds/${service.id}.svg`} height="16px" width="16px" alt={service.id} title={service.id} />
        <span style={{ paddingLeft: '10px' }}>{service.name}</span>
      </Menu.Item>
    ))}
  </Menu>
);
ServicesList.displayName = 'ServicesList';
ServicesList.propTypes = {
  services: PropTypes.array.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
};
export default ServicesList;
