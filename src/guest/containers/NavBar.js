import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="ui blue inverted top fixed secondary menu">
    <div className="ui container">
      <div className="item">
        <Link to="/">
          <img src="/images/std_logo_small.png" alt="Savetodrive" width="120px" />
        </Link>
      </div>
      <div className="right menu" id="navbarTogglerDemo02">
        <a className="item" href="https://web.savetodrive.net/plans" rel="noopener">
          Pricing
        </a>
        <Link className="item" to="/register">
          Register
        </Link>
        <Link className="item" to="/login">
          Login
        </Link>
        <div className="item" />
      </div>
    </div>
  </nav>
);

export default NavBar;
