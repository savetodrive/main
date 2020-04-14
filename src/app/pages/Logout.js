import React from 'react';
import { LOGIN_PATH } from 'consts';

export default class Logout extends React.Component {
  UNSAFE_componentWillMount() {
    setTimeout(() => {
      window.localStorage.removeItem('token');
      window.location.href = LOGIN_PATH;
    }, 2000);
  }

  render() {
    return <div className="alert alert-danger">Logging out...</div>;
  }
}
