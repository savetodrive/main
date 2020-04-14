import React from 'react';
import { Form, Input, Button, message, Card, Row, Col, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { userProfileUpdate } from '../actions/MeActions';
import SettingsLayout from '../../components/layouts/Settings';

const FormItem = Form.Item;

class Me extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.actions.userProfileUpdate(values).then(() => message.success('Profile has been updated.'), (error) => message.error(error));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <SettingsLayout>
        <Card>
          <h2>Profile</h2>
          <Divider />
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="First Name">
                  {getFieldDecorator('first_name', {
                    rules: [{ required: true, message: 'Please input your first name!' }],
                    initialValue: this.props.user.first_name,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Last Name">
                  {getFieldDecorator('last_name', {
                    rules: [{ required: true, message: 'Please input your last name!' }],
                    initialValue: this.props.user.last_name,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={16}>
                <FormItem label="Email">
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                    initialValue: this.props.user.email,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" size="large" htmlType="submit">
                Save
              </Button>
            </FormItem>
          </Form>
        </Card>
      </SettingsLayout>
    );
  }
}

const WrappedApp = Form.create()(Me);

Me.propTypes = {
  user: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ userProfileUpdate }, dispatch),
});
export default withRouter(connect(mapStateToProps, mapActionToProps)(WrappedApp));
