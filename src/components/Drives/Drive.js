import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Button, Card, Image } from 'semantic-ui-react';
import { popupOpener } from '../../Utils';

class Drive extends React.Component {
  authenticateHandler(service) {
    return () => {
      popupOpener(service.service, service.url);
    };
  }

  render() {
    const { label, status, user } = this.props.service;
    return (
      <Card>
        <Card.Content>
          <Image floated="right" size="mini" src={user.img} shape="circular" />
          <Card.Header>
            <span className="mr-1">{label}</span>
            <Icon
              size="small"
              name="circle"
              color={status ? 'green' : 'red'}
              title={user.name ? 'Connected' : 'Not Connected'}
            />
          </Card.Header>
          <Card.Meta>
            Connected with {user.name || 'None'}
          </Card.Meta>
          <Card.Description>
            {this.props.service.meta}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button
              basic
              color={status ? 'green' : 'red'}
              fluid
              onClick={this.authenticateHandler(this.props.service)}
            >
              {status ? 'Connect Again' : 'Connect'}
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Drive.propTypes = {
  service: PropTypes.object.isRequired,
};
export default Drive;
