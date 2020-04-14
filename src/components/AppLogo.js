import PropTypes from 'prop-types';
import React from 'react';

const innerStyle = {
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '10px',
};
const AppLogo = ({ path = '/' }) => (
  <a href={path}>
    <h2 style={innerStyle} className="text-center text-white">
      <img src="/images/std.png" alt="Savetodrive" width="250px" />
    </h2>
  </a>
);

AppLogo.propTypes = {
  path: PropTypes.string,
};

AppLogo.defaultProps = {
  path: '/',
};
export default AppLogo;
