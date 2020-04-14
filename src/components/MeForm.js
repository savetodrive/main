import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';
// import renderField from 'components/common/Field';

const MeForm = ({ handleSubmit, submitting }) => (
  <Grid stackable doubling container>
    <Grid.Column mobile={16} tablet={12} computer={9}>
      <Form as="form" name="register" method="post" onSubmit={handleSubmit}>
        <Form.Field>{/* <Field name="first_name" type="text" component={renderField} label="First Name" /> */}</Form.Field>
        <Form.Field>{/* <Field name="last_name" type="text" component={renderField} label="Last Name" /> */}</Form.Field>
        <Form.Field>{/* <Field name="email" type="email" disabled component={renderField} label="Email" /> */}</Form.Field>
        <Button color="blue" type="submit" value="Update" disabled={submitting}>
          Update
        </Button>
      </Form>
    </Grid.Column>
  </Grid>
);

MeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};
export default MeForm;
