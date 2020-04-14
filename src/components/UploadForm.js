/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { Label, Form, Button } from 'semantic-ui-react';
// import renderField from 'components/common/Field';

class UploadForm extends React.Component {
  constructor() {
    super();
    this.state = {
      isNewFileName: false,
      shouldSendEmail: false,
      file_name: null
    };
  }

  onShouldSendEmailClick() {
    this.setState({
      shouldSendEmail: !this.state.shouldSendEmail
    });
  }

  changeFileName() {
    this.setState({
      isNewFileName: !this.state.isNewFileName,
      file_name: null
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Form role="form" name="register" method="post" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div>{/* <Field name="file_url" type="url" component={renderField} label="URL" placeholder="Enter your url here." /> */}</div>
            <div>
              <div>
                {/* <Field name="isNewFileName" value={this.state.isNewFileName} onClick={this.changeFileName} component="input" type="checkbox" />{' '} */}
                <div>Change file name</div>
              </div>
              <div>
                {/* <Field
                  name="shouldSendEmail"
                  value={this.state.shouldSendEmail}
                  onClick={this.onShouldSendEmailClick}
                  component="input"
                  type="checkbox"
                />{' '} */}
                <Label>Send me email whenever file upload is success or error</Label>
              </div>
            </div>
            <div>
              {/* {this.state.isNewFileName && (
                <Field
                  name="file_name"
                  type="text"
                  value={this.state.file_name}
                  component={renderField}
                  label="Filename"
                  placeholder="Enter new file name."
                />
              )} */}
            </div>
            <div>
              <Button disabled={submitting} type="submit" bsStyle="primary">
                Upload
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

UploadForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};
export default UploadForm;
