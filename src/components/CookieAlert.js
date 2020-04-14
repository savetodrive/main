import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CookieAlert = (
  { onAccept = () => null } // eslint-disable-line
) => (
  <div className="sd-cookie-alert text-center">
    <p>
      We use cookies to make interactions with our service easy and meaningful. Please check our &nbsp;
      <Link to="https://web.savetodrive.net/privacy-policy" target="_blank">
        privacy policy
      </Link>{' '}
      for more information.
    </p>
    <Button inverted size="mini" onClick={onAccept}>
      I Accept
    </Button>
  </div>
);
export default CookieAlert;
