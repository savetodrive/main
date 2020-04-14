import React from 'react';
import { Grid, List, Segment } from 'semantic-ui-react';

const Footer = () => (
  <Segment tertiary vertical padded>
    <Grid container>
      <Grid.Column verticalAlign="middle" mobile="16" computer="6">
        &copy; 2016-2018 - Savetodrive - All rights reserved.
      </Grid.Column>
      <Grid.Column floated="right" verticalAlign="middle" mobile="16" computer="5">
        <List horizontal>
          <List.Item as="a" href="https://web.savetodrive.net">
            Blogs
          </List.Item>
          <List.Item as="a" href="http://web.savetodrive.net/privacy/">
            Privacy
          </List.Item>
          <List.Item as="a" href="http://web.savetodrive.net/terms/">
            Terms
          </List.Item>
          <List.Item target="_blank" as="a" href="https://www.fb.com/savetodrive">
            Contact Us
          </List.Item>
        </List>
      </Grid.Column>
    </Grid>
  </Segment>
);
export default Footer;
