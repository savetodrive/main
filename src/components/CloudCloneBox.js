import React from 'react';
import PropTypes from 'prop-types';
import { Card, Divider } from 'antd';
import Directory from './Directory';
import ConnectionDropDown from './connections/ConnectionDropDown';

class CloudCloneBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Card>
        <ConnectionDropDown selected={this.props.mover} handleChange={this.props.handleConnectionSelect} connections={this.props.connections} />
        <Divider />
        <Directory
          disableDragging={this.props.disableDragging}
          handleClone={this.props.handleClone}
          mover={this.props.mover}
          handleItemSelect={this.props.handleItemSelect}
          loading={this.props.loading}
        />
      </Card>
    );
  }
}
CloudCloneBox.defaultProps = {
  loading: false,
  disableDragging: false,
};
CloudCloneBox.propTypes = {
  disableDragging: PropTypes.bool,
  connections: PropTypes.array.isRequired,
  handleConnectionSelect: PropTypes.func.isRequired,
  mover: PropTypes.object.isRequired,
  handleItemSelect: PropTypes.func.isRequired,
  handleClone: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
export default CloudCloneBox;
