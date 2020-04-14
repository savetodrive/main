/* eslint-disable react/no-array-index-key */
import React from 'react';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import prettySize from 'prettysize';
import { Card, Statistic, Header, Button, List } from 'semantic-ui-react';

const Plan = ({ plan, handlePlanSelect }) => (
  <Card>
    <Header as="h3" block>
      {startCase(plan.name)}
    </Header>{' '}
    <Statistic>
      <Statistic.Value>{plan.price}$</Statistic.Value>
      <Statistic.Label>Month</Statistic.Label>
    </Statistic>
    <Card.Content>
      <Card.Header>{prettySize(plan.features.bytes_quota)}</Card.Header>
      <Card.Meta>
        <span className="date">Bandwidth</span>
      </Card.Meta>
      <Card.Description>
        <List divided relaxed>
          {plan.description.map((desc, index) => (
            <List.Item key={index}>
              <List.Content>
                <List.Description as="a">{desc}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button primary onClick={handlePlanSelect(plan)}>
        Sign Up
      </Button>
      <Button primary>
        <a style={{ color: 'white' }} href={`https://web.savetodrive.net/beta-plan-${plan.provider_plan_code}`} rel="noopener" target="_blank">
          More
        </a>
      </Button>
      <br />
    </Card.Content>
  </Card>
);
Plan.propTypes = {
  plan: PropTypes.object.isRequired,
  handlePlanSelect: PropTypes.func.isRequired,
};
export default Plan;
