import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List, Item } from 'semantic-ui-react';
import GoogleAd from '../../components/ads/GoogleAd';
import AdsReloader from '../../components/AddReloader';

const LoadableHome = ({ isAds }) => (
  <Grid.Column mobile="16" computer="5">
    {process.env.NODE_ENV !== 'development' ? (
      <List celled>
        <List.Item>
          <List.Content>
            <AdsReloader status={isAds} ads={() => <GoogleAd type={GoogleAd.LARGE_RECTANGLE} />} />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <Item.Group>
              <Item>
                <Item.Image size="mini" src="/images/facebook-logo.png" />

                <Item.Content>
                  <Item.Header href="https://www.facebook.com/savetodrive" target="_blank" as="a">
                    Facebook
                  </Item.Header>
                </Item.Content>
              </Item>

              <Item>
                <Item.Image size="mini" src="/images/twitter-logo.png" />
                <Item.Content>
                  <Item.Header href="https://www.twitter.com/savetodrive" target="_blank" as="a">
                    Twitter
                  </Item.Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </List.Content>
        </List.Item>
      </List>
    ) : (
      ''
    )}
  </Grid.Column>
);
LoadableHome.propTypes = {
  isAds: PropTypes.bool.isRequired,
};
export default LoadableHome;
