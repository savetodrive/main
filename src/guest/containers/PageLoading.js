import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Loader } from 'semantic-ui-react';

const PageLoading = ({ isLoading }) =>
  (isLoading ? (
    <Grid centered padded className="login-screen">
      <Loader active size="large">
        <span style={{ color: 'white' }}> Loading</span>
      </Loader>
    </Grid>
  ) : null);

PageLoading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
export default PageLoading;
