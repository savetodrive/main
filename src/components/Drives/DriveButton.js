import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'semantic-ui-react';

function DriveButton(props) {
  return (
    <div>
      <Button
        onClick={props.authenticateHandler}
        className="pt-button pt-intent-primary"
      > Connect
      </Button>
    </div>
  );
}
DriveButton.propTypes = {
  authenticateHandler: PropTypes.func.isRequired,
};

export default DriveButton;
