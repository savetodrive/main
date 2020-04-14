import PropTypes from 'prop-types';
import React from 'react';

function DriveLabel(props) {
  return <div>{props.label}</div>;
}

DriveLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default DriveLabel;
