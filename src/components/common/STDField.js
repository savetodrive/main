import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Label } from 'semantic-ui-react';
import { Field as FormikField } from 'formik';
import startCase from 'lodash/fp/startCase';

const STDField = ({
  touched, errors, name, label, type,
}) => (
  <Form.Field>
    <FormikField
      name={name}
      render={({ field }) => <Input type={type} error={!!(touched[name] && errors[name])} {...field} placeholder={label} label={label} />}
    />
    {touched[name] &&
      (errors[name] && (
        <Label basic color="red" pointing>
          {startCase(errors[name])}
        </Label>
      ))}
  </Form.Field>
);
STDField.defaultProps = {
  type: 'text',
};
STDField.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};
export default STDField;
