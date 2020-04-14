/* eslint-disable */
import React from 'react';
import { Timeline } from 'react-twitter-widgets';

const Twitter = () => (
  <Timeline
    dataSource={{
      sourceType: 'profile',
      screenName: 'SaveToDrive'
    }}
    options={{
      username: 'savetodrive',
      height: '400'
    }}
  />
);
export default Twitter;
