import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { withFormik, Form as Formik } from 'formik';
import Yup from 'yup';
import STDField from '../common/STDField';
import Captcha from '../Captcha';

const RegisterForm = ({ errors, touched, loading }) => (
  <Formik>
    <Form as="div" loading={loading}>
      <STDField errors={errors} touched={touched} name="first_name" label="First Name" />
      <STDField errors={errors} touched={touched} name="last_name" label="Last Name" />
      <STDField errors={errors} touched={touched} name="email" label="Email" />
      <STDField errors={errors} touched={touched} name="password" type="password" label="Password" />{' '}
      <STDField errors={errors} touched={touched} name="coupon" label="Coupon" />
      <Form.Field>
        By clicking Register, you agree to our&nbsp;
        <a rel="noopener noreferrer" href="https://web.savetodrive.net/terms" target="_blank">
          Terms
        </a>
        &nbsp; and that you have read our{' '}
        <a href="https://web.savetodrive.net/privacy" rel="noopener noreferrer" target="_blank">
          Policy
        </a>
        , including our cookie usage.
      </Form.Field>
      <Form.Field style={{ marginLeft: '25%' }}>
        <Captcha />
      </Form.Field>
      <Button color="green" type="submit" value="Register" className="mr-2">
        Register
      </Button>
      <span className="small text-muted">
        Already have account? <Link to="/login">Log In</Link>
      </span>
    </Form>
  </Formik>
);
const RegisterFormik = withFormik({
  // prettier-ignore
  mapPropsToValues({ first_name = '', last_name = '', email = '', password = '', handleSubmit }) { // eslint-disable-line
    return {
      first_name,
      last_name,
      email,
      password,
      handleSubmit,
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    password: Yup.string()
      .min(8)
      .required(),
  }),
  handleSubmit(values, args) {
    args.props.handleSubmit(values, args);
  },
})(RegisterForm);

RegisterForm.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default RegisterFormik;
