// https://docs.fastspring.com/storefronts/popup-storefronts-on-your-website/validating-popup-storefront-orders
/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import isPast from 'date-fns/is_past';
import { connect } from 'react-redux';
import autobind from 'auto-bind';
import { Col, Row, Spin, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { fetchPlan } from '../actions/index';
import Plan from '../../components/subscriptions/Plan';
import { getVerifyOrderId, getFastspringSecurePayload } from '../../api/app';
import { injectFastSpringScript } from '../../Utils';
import '../../styles/plans.css';

const VERIFICATION_WAIT_TIME = 20000;

// 4012000033330026 -> Test Credit card
class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.secureData = null;
    this.state = {
      loading: true,
      current: 0,
      loadingTip: 'Please wait...',
      // subscription: {
      //   plan: null
      // }
      paymentContainer: 'paymentContainer',
      clientToken: null,
      loading: true,
      plan: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const user = nextProps.user;
      if (user && user.subscription.ends_at) {
        if (!isPast(user.subscription.ends_at)) {
          return (window.location.href = '/app');
        }
      }
    }
  }
  fetchFastspringSecurePayload() {
    return getFastspringSecurePayload().catch(() => {
      message.error('Unable to fetch secure data.');
    });
  }
  verifyOrder(orderReference) {
    getVerifyOrderId(orderReference.id)
      .then(() => {
        window.location.href = '/app';
      })
      .catch(() => {
        message.error('We are unable to verify order, please contact our support <support@savetodrive.net>');
      });
  }
  componentDidMount() {
    const self = this;
    if (!window.onstdpaymentclosed) {
      window.onstdpaymentclosed = function onstdpaymentclosed(orderReference) {
        if (!orderReference) return;
        self.setState({
          loading: true,
          loadingTip: 'Please wait! We are processing your account, it will take sometime...',
        });
        clearTimeout(window.onstdpaymentclosedTimeout);
        // Intentionally wait for specified amount time
        // to have a buffer time for fastspring hit our app api.
        window.onstdpaymentclosedTimeout = setTimeout(() => {
          self.verifyOrder(orderReference);
        }, VERIFICATION_WAIT_TIME);
      };
    }
    this.loading(true);
    this.fetchFastspringSecurePayload().then((response) => {
      this.secureData = response.data;
      if (!Subscribe.IS_INJECTED) {
        injectFastSpringScript(this.secureData);
        Subscribe.IS_INJECTED = true;
      }
      if (!this.props.plans.length) {
        this.props.actions.fetchPlan().finally(() => {
          this.loading(false);
        });
      } else {
        this.loading(false);
      }
    });

    return true;
  }
  loading(loading) {
    this.setState({
      loading,
    });
  }

  initPaymentContainer() {
    this.loading(false);
  }

  getSteps() {
    return [
      {
        title: 'Choose Plan',
        content: this.renderPlans(),
      },
    ];
  }
  next() {
    const { user } = this.props;
    if (!this.secureData) {
      return message.error('Unable to init payment box, please reload and try again.');
    }

    if (!this.state.plan) {
      return;
    }
    // fastspring.builder.secure(this.secureData.securePayload, this.secureData.secureKey); // eslint-disable-line
    const fscSession = {
      reset: true,
      paymentContact: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: ' ',
      },
      firstname: 'samundra',
      products: [
        {
          path: this.state.plan.provider_plan_code,
          quantity: 1,
        },
      ],
      contact: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
      accountCustomKey: user._id,
      account: user.subscription.customer_id,
      checkout: true,
    };
    if (!window.fastspring) {
      return alert('Some problem occured, please reload this page and try again'); // eslint-disable-line
    }
    fastspring.builder.push(fscSession);
    return true;
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  handlePlanSelect(plan) {
    return () => {
      if (this.state.plan && plan._id === this.state.plan._id) return;
      return this.setState({
        plan,
      });
    };
  }
  handlePayment() {
    if (!this.instance) {
      message.error('Unable to proceed payment.', 'error');
      return false;
    }

    this.loading(true);
    //   return this.instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
    //     // Submit payload.nonce to your server
    //     this.loading(false);
    //     if (requestPaymentMethodErr) {
    //       return message.error(requestPaymentMethodErr.message, 'error');
    //     }

    //     this.loading(true);
    //     const plan = this.state.plan.name;
    //     subscribe(plan.toLowerCase(), { nonce: payload.nonce })
    //       .then(() => {
    //         message.success(`You have been successfully subscribed to ${plan}`);
    //         window.location.href = '/app';
    //       })
    //       .catch((error) => {
    //         if (error.response && error.response.data.message) {
    //           return message.error(error.response.data.message, 'error');
    //         }

    //         return message.error('Some problem occurred, please try again.');
    //       })
    //       .finally(() => {
    //         this.loading(false);
    //       });
    //     return true;
    //   });
  }
  renderPlans() {
    return (
      <Row gutter={16}>
        {this.props.plans.map((plan) => (
          <Col span={6} key={plan._id}>
            <Plan key={plan._id} plan={plan} onSelect={this.handlePlanSelect} selected={this.state.plan ? this.state.plan._id : 'none'} />
          </Col>
        ))}
      </Row>
    );
  }

  render() {
    const steps = this.getSteps();
    return (
      <div>
        <Spin spinning={this.state.loading} tip={this.state.loadingTip}>
          <div className="steps-content">
            {steps.map((item, index) => {
              return (
                <div key={item.title} style={{ display: index === this.state.current ? 'block' : 'none' }}>
                  {item.content}
                </div>
              );
            })}
          </div>
          <hr />
          <div className="steps-action">
            {this.state.current < steps.length - 1 && (
              <Button type="primary" onClick={this.next}>
                Next
              </Button>
            )}
            {this.state.current === steps.length - 1 && (
              <Button size="large" type="primary" onClick={this.next}>
                Checkout
              </Button>
            )}
            {this.state.current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={this.prev}>
                Previous
              </Button>
            )}
          </div>
        </Spin>
      </div>
    );
  }
  setInstance(instance) {
    this.instance = instance;
  }
}
Subscribe.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  plans: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.app.user,
  plans: state.app.plans,
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ fetchPlan }, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionToProps,
  )(Subscribe),
);
