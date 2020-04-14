import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav className="ui blue inverted top fixed secondary menu">
    <div className="ui container">
      <div className="item">
        <Link to="/">
          <img src="/images/std_logo_small.png" alt="Savetodrive" width="120px" />
        </Link>
      </div>
      <div className="right menu" id="navbarTogglerDemo02">
        <Link to="/" className="item">
          Upload
        </Link>
        <Link to="/me" className="item">
          Me
        </Link>
        <Link to="/drives" className="item">
          Drives
        </Link>
        <Link to="/logout" className="item">
          Logout
        </Link>
      </div>
    </div>
  </nav>
);

export default Header;
