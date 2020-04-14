/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import startCase from 'lodash/fp/startCase';
import { withRouter } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words_to_now';
import { bindActionCreators } from 'redux';
import { Button, message, Card, Divider, List, Spin } from 'antd';
import ProtectedPage from './ProtectedPage';
import { cancelSubscription } from '../../api/app';
import SettingsLayout from '../../components/layouts/Settings';
import BytesUsage from '../../components/BytesUsage';
import { updateSubscription } from '../actions';
import { injectFastSpringScript } from '../../Utils';

const format = require('date-fns/format');

class Subscription extends ProtectedPage {
  constructor() {
    super();
    this.state = {
      subscriptions: [],
      current: {},
      loading: false,
      isCancelled: false,
    };
    this.cancel = this.cancel.bind(this);
  }

  cancel() {
    if (this.isCancelled()) return;
    if (!confirm('Are you sure, you want to cancel subscription')) return;
    this.setState({
      loading: true,
    });
    cancelSubscription()
      .then((response) => {
        this.setState({
          isCancelled: true,
        });
        message.info('Your subscription has been cancelled, and will be effective from next billing cycle.');
      })
      .catch((err) => {
        message.error('We are unable to cancel subscription. May be you already cancelled subscription.');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  renderExpires(subscription) {
    return (
      <div>
        {format(subscription.ends_at, 'DD MMM YYYY')} <small> ({distanceInWords(subscription.ends_at)} Remaining)</small>
      </div>
    );
  }
  isCancelled() {
    return this.props.user.subscription.is_cancelled || this.state.isCancelled;
  }
  render() {
    const { plan = null, subscription } = this.props.user;
    return (
      <SettingsLayout>
        <Card>
          <h2>Subscription</h2>
          <Divider />
          Usage
          <BytesUsage user={this.props.user} />
          <Divider />
          <Spin spinning={this.state.loading}>
            {plan && (
              <List itemLayout="horizontal">
                <List.Item>
                  <List.Item.Meta title="Plan" description={startCase(plan.name)} />
                </List.Item>
                <List.Item>
                  <List.Item.Meta title="Price" description={`${plan.price}$`} />
                </List.Item>
                <List.Item>
                  <Button type="danger" disabled={this.isCancelled()} onClick={this.cancel}>
                    {this.isCancelled() ? (
                      <small>Your subscription has been cancelled, and will be effective from next billing cycle.</small>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </Button>
                  <br />
                </List.Item>
              </List>
            )}
          </Spin>
        </Card>
      </SettingsLayout>
    );
  }
}

Subscription.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.app.user,
});
const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ updateSubscription }, dispatch),
});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionToProps,
  )(Subscription),
);
