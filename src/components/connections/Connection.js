import React from 'react';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import { Icon, Card, Avatar, Popconfirm } from 'antd';

const { Meta } = Card;

const Connection = ({ connection, handleServiceInAction }) => (
  <Card
    actions={[
      <Icon type="sync" title="Connect" onClick={handleServiceInAction(connection, 'connect')} />,
      <Popconfirm title="Are you sure delete this connection?" onConfirm={handleServiceInAction(connection, 'delete')} okText="Yes" cancelText="No">
        <Icon type="delete" title="delete" />
      </Popconfirm>,
    ]}
  >
    <Meta
      avatar={<Avatar src={`../images/clouds/${connection.service_type}.svg`} />}
      title={
        <div>
          <div
            style={{
              color: '#9b9b9b',
              marginBottom: '.5rem',
              fontSize: '.8rem',
              fontWeight: 'bold',
            }}
          >
            {startCase(connection.service_type)}
            <span style={{ display: 'inline-block', marginLeft: '.5rem', fontSize: '1rem' }}>
              {connection.status ? (
                <Icon type="check-circle" title="connected" style={{ color: 'green' }} />
              ) : (
                <Icon type="close-circle" title="Not Connected" style={{ color: 'red' }} />
              )}
            </span>
          </div>
          <div>
            {' '}
            {startCase(connection.profile.name)}{' '}
          </div>
        </div>
      }
      description={<small> Connected as {connection.profile.email || connection.profile.name} </small>}
    />
  </Card>
);
Connection.propTypes = {
  connection: PropTypes.object.isRequired,
  handleServiceInAction: PropTypes.func.isRequired,
};
export default Connection;
