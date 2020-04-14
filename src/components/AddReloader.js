import PropTypes from 'prop-types';
import React from 'react';

const AdReloader = ({ status, ads }) => (status ? ads() : <div />);

AdReloader.propTypes = {
  ads: PropTypes.func.isRequired,
  status: PropTypes.bool.isRequired,
};
AdReloader.displayName = AdReloader;
export default AdReloader;
