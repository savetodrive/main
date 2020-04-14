import React, { Fragment } from 'react';
import startCase from 'lodash/fp/startCase';
import renderIf from 'render-if';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import { Input, Button, Icon, Select, Row, Col, Checkbox, Form, Divider } from 'antd';
import Urls from '../Urls';

const { Option } = Select;

class RemoteUploadForm extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {};
  }

  getServices() {
    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        value={this.props.upload.connections}
        placeholder="Select Connections"
        onChange={this.handleChange}
      >
        {this.props.connections
          .filter((c) => c.status)
          .map((connection) => (
            <Option key={connection._id} title={connection.profile.email || connection.profile.name}>
              <img
                src={`../images/clouds/${connection.service_type}.svg`}
                height="16px"
                width="16px"
                alt={startCase(connection.service_type)}
                title={startCase(connection.service_type)}
              />
              {connection.profile.name} &lt;
              {startCase(connection.service_type)}
              &gt;
            </Option>
          ))}
      </Select>
    );
  }

  handleChange(value) {
    this.props.fieldChange('connections')({
      target: {
        value,
      },
    });
  }

  render() {
    const { upload } = this.props;
    return (
      <Row>
        <Form>
          <Form.Item>
            <Urls
              uploads={this.props.uploads}
              urls={this.props.upload.urls}
              handleChange={this.props.handleUrlChanges}
              handleRemove={this.props.handleUrlRemove}
            />
            <Button type="primary" onClick={this.props.handleAddUrlField}>
              <Icon type="upload" />
              Add Url
            </Button>
            {this.getServices()}
          </Form.Item>

          <Form.Item>
            <div style={{ width: '100%' }}>
              <Row>
                <Col span={12}>
                  <Checkbox defaultChecked={upload.isEmail} checked={upload.isEmail} onClick={this.props.handleChange('isEmail')}>
                    Email me on upload success/error
                  </Checkbox>
                  {renderIf(upload.isEmail)(
                    <Input onChange={this.props.fieldChange('email')} value={upload.email} addonBefore="Email" placeholder="Enter Email" />,
                  )}
                </Col>
                <Col span={12}>
                  {renderIf(upload.urls.length === 1)(
                    <Fragment>
                      {' '}
                      <Checkbox defaultChecked={upload.isFilename} checked={upload.isFilename} onClick={this.props.handleChange('isFilename')}>
                        Change File Name
                      </Checkbox>
                      {renderIf(upload.isFilename)(
                        <Input
                          onChange={this.props.fieldChange('filename')}
                          value={upload.filename}
                          addonBefore="Filename"
                          placeholder="Enter Filename"
                        />,
                      )}
                    </Fragment>,
                  )}
                </Col>
              </Row>
            </div>
          </Form.Item>
          <Divider />
          <Row type="flex" justify="space-between" align="middle">
            <Col>{/* <a href="/">Advance Settings</a> */}</Col>
            <Col>
              <Button type="primary" size="large" onClick={this.props.handleUpload}>
                <Icon type="upload" />
                Upload
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    );
  }
}

RemoteUploadForm.propTypes = {
  upload: PropTypes.object.isRequired,
  connections: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  fieldChange: PropTypes.func.isRequired,
  handleAddUrlField: PropTypes.func.isRequired,
  handleUrlChanges: PropTypes.func.isRequired,
  handleUrlRemove: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
  uploads: PropTypes.array.isRequired,
};
export default RemoteUploadForm;
