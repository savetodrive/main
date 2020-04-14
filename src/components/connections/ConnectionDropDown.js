import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import startCase from 'lodash/fp/startCase';

const { Option } = Select;

const ConnectionDropDown = ({ connections, handleChange = () => null, selected }) => (
  <Select
    value={selected.connection._id}
    showSearch
    style={{ width: '100%' }}
    placeholder="Select Connection"
    optionFilterProp="children"
    onChange={handleChange}
  >
    {connections.map((connection) =>
      (connection.status ? (
        <Option value={connection._id} key={connection._id}>
          <img
            src={`../images/clouds/${connection.service_type}.svg`}
            height="16px"
            width="16px"
            alt={startCase(connection.service_type)}
            title={startCase(connection.service_type)}
          />
          {connection.unique_id} &lt;
          {startCase(connection.service_type)}
          &gt;
        </Option>
      ) : (
        ''
      )),
    )}
  </Select>
);
ConnectionDropDown.propTypes = {
  handleChange: PropTypes.func.isRequired,
  connections: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
};
export default ConnectionDropDown;
