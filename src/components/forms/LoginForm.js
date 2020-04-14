import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { withFormik, Form as Formik } from 'formik';
import Yup from 'yup';
import STDField from '../common/STDField';
import Captcha from '../Captcha';

const LoginForm = ({ errors, touched, loading }) => (
  <Formik>
    <Form as="div" loading={loading}>
      <STDField errors={errors} touched={touched} name="email" label="Email" />
      <STDField errors={errors} touched={touched} name="password" type="password" label="Password" />
      <Form.Field style={{ marginLeft: '25%' }}>
        <Captcha />
      </Form.Field>
      <Button fluid color="green" type="submit" value="Login">
        Log In
      </Button>
      <div className="mt-1">
        <Link to="/forgot-password" className="small text-muted">
          Forgot password?
        </Link>
      </div>
    </Form>
  </Formik>
);
const LoginFormik = withFormik({
  // prettier-ignore
  mapPropsToValues({ email = '', password = '', handleSubmit }) { // eslint-disable-line
    return {
      email,
      password,
      handleSubmit,
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .min(8)
      .required(),
  }),
  handleSubmit(values, args) {
    args.props.handleSubmit(values, args);
  },
})(LoginForm);

LoginForm.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default LoginFormik;
