import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header" />
    </div>
    <ul className="nav navbar-nav navbar-right">
      <li>
        <Link to="/login">
          Logins
        </Link>
      </li>
      <li>
        <Link to="/register">
          Register
        </Link>
      </li>
    </ul>
  </nav>
);

export default Header;
