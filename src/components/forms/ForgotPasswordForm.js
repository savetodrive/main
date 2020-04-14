import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { withFormik, Form as Formik } from 'formik';
import Yup from 'yup';
import STDField from '../common/STDField';

const ForgotPassword = ({ errors, touched, loading }) => (
  <Formik>
    <Form as="div" loading={loading}>
      <STDField errors={errors} touched={touched} name="email" label="Email" />
      <Button fluid color="green" type="submit" value="submit">
        Submit
      </Button>
      <div className="mt-1">
        <Link to="/login" className="small text-muted">
          Login
        </Link>{' '}
        /{' '}
        <Link to="/register" className="small text-muted">
          Register
        </Link>
      </div>
    </Form>
  </Formik>
);
const ForgotPasswordFormik = withFormik({
  // prettier-ignore
  mapPropsToValues({ email = '', handleSubmit }) { // eslint-disable-line
    return {
      email,
      handleSubmit,
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
  }),
  handleSubmit(values, args) {
    args.props.handleSubmit(values, args);
  },
})(ForgotPassword);

ForgotPassword.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default ForgotPasswordFormik;
