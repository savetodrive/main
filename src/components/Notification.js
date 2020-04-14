import React from 'react';
import { notification, Icon } from 'antd';

const Notification = {
  show({ description, message, icon }) {
    notification.open({
      message,
      description,
      icon,
    });
  },
  info(message, description) {
    Notification.show({
      message,
      description,
      icon: <Icon type="info-circle" style={{ color: 'blue' }} />,
    });
  },
  success(message, description) {
    Notification.show({
      message,
      description,
      icon: <Icon type="check-circle" style={{ color: 'green' }} />,
    });
  },
  error(message, description) {
    notification.open({
      message,
      description,
      icon: <Icon type="close-circle" style={{ color: 'red' }} />,
    });
  },
};

export default Notification;
