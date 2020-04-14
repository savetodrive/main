/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import isPast from 'date-fns/is_past';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (user && user.subscription.ends_at && isPast(user.subscription.ends_at)) {
        return <Redirect to={{ pathname: '/subscribe' }} />;
      }

      return <Component {...rest} {...props} />;
    }}
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object.isRequired,
  // component: PropTypes.func.isRequired
};
export default PrivateRoute;
