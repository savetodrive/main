/* eslint-disable */
import PropTypes from 'prop-types';

import React from 'react';
import { Label, Input, Form } from 'semantic-ui-react';

const renderField = ({ input, label, type, disabled, placeholder, meta: { touched, error, warning } }) => (
  <Form.Field>
    <Input
      label={label}
      {...input}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      error={(touched && (error && true)) || (warning && true)}
    />
    {touched &&
      ((error && (
        <Label basic color={'red'} pointing>
          {error}
        </Label>
      )) ||
        (warning && (
          <Label basic color={'yellow'} pointing>
            {warning}
          </Label>
        )))}
  </Form.Field>
);
renderField.propTypes = {
  input: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default renderField;
