import PropTypes from 'prop-types';
import React from 'react';
import { Message } from 'semantic-ui-react';

function Error(props) {
  let messageContainer = props.messages;
  if (!Array.isArray(messageContainer)) {
    messageContainer = [messageContainer];
  }

  return (
    <Message error>
      <Message.Header>Action Forbidden</Message.Header>
      <Message.List>{messageContainer.map(message => <Message.Item key={Date.now()}>{message}</Message.Item>)}</Message.List>
    </Message>
  );
}

Error.propTypes = {
  messages: PropTypes.any.isRequired, // eslint-disable-line
};

export default Error;
