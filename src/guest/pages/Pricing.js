/* eslint-disable */
import React from 'react';
import { Grid, Segment, Header, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getAllPlans } from '../../api/app';
import Plan from '../containers/Plan';

class Pricing extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      plans: []
    };
  }

  componentDidMount() {
    this.fetchPlans();
  }
  fetchPlans() {
    this.setState({
      loading: true
    });
    getAllPlans()
      .then((response) => {
        this.setState({
          plans: response.data
        });
      })
      .catch(() => {
        alert('Unable to fetch plans'); // eslint-disable-line
      })
      .finally(() => {
        this.setState({
          loading: false
        });
      });
  }
  handlePlanSelect(plan) {
    return () => {
      this.props.history.push('/register');
    };
  }
  render() {
    return (
      <Grid centered padded className="login-screen">
        <Grid.Column mobile={16} tablet={10} computer={16}>
          <Segment>
            <Header size="huge">Choose the Plan That's Right for You</Header>
            <Segment>
              <Grid columns="four" divided>
                <Grid.Row>
                  <Dimmer active={this.state.loading}>
                    <Loader />
                  </Dimmer>
                  {this.state.plans.map((plan) => (
                    <Grid.Column key={plan._id}>
                      <Plan handlePlanSelect={this.handlePlanSelect.bind(this)} plan={plan} />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </Segment>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default withRouter(Pricing);
