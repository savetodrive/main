// import PropTypes from 'prop-types';
import React from 'react';
// import isPast from 'date-fns/is_past';

class ProtectedPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  // UNSAFE_componentWillMount() {
  //   const { subscription = {} } = this.props.user;
  //   if (isPast(subscription.ends_at)) {
  // return this.props.history.push('/payment');
  //   }
  //   return true;
  // }
}

ProtectedPage.propTypes = {
  // user: PropTypes.object.isRequired
  // history: PropTypes.object.isRequired
};

export default ProtectedPage;
