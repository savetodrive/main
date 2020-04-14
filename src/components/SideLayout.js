import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Menu } from 'semantic-ui-react';

function SideLayout({ children }) {
  return (
    <Grid.Column width={16}>
      <Segment>
        <Grid>
          <Grid.Column mobile={16} tablet={6} computer={4}>
            <Menu fluid vertical tabular pointing secondary>
              <Menu.Item active>
                <Link to="/me">Edit Profile</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/drives">Authorize App</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/uploads">Uploads</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/subscription">Subscription</Link>
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={10} computer={12}>
            {children}
          </Grid.Column>
        </Grid>
      </Segment>
    </Grid.Column>
  );
}

SideLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default SideLayout;
