import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { withFormik, Form as Formik } from 'formik';
import Yup from 'yup';
import STDField from '../common/STDField';

const CreatePasswordForm = ({ errors, touched, loading }) => (
  <Formik>
    <Form as="div" loading={loading}>
      <STDField errors={errors} touched={touched} name="password" type="password" label="Password" />
      <Button fluid color="green" type="submit" value="submit">
        Submit
      </Button>
    </Form>
  </Formik>
);

CreatePasswordForm.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const CreatePasswordFormik = withFormik({
  mapPropsToValues({ password = '', handleSubmit }) {
    // eslint-disable-line
    return {
      password,
      handleSubmit,
    };
  },
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .min(8)
      .required(),
  }),
  handleSubmit(values, args) {
    args.props.handleSubmit(values, args);
  },
})(CreatePasswordForm);
export default CreatePasswordFormik;
