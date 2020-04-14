/* eslint-disable react/display-name */
import PropTypes from 'prop-types';

import React from 'react';
import { Tab, Menu, Icon } from 'semantic-ui-react';
import renderIf from 'render-if';
import Task from '../components/TabItem';
import { getUniqKey } from '../Utils/index';

class TabsContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.task.isStarted) {
      this.props.actions.processStarted(this.props.index);
      this.startProcess();
    }
    console.log('mounted');
  }

  getTabs() {
    return this.props.task.tabs.map((item, index) => ({
      menuItem: (
        <Menu.Item key={getUniqKey()}>
          <svg className="icon icon--info">
            <use xlinkHref={`#${item.service.service}`} />
          </svg>
          {item.service.label}
          {renderIf(index === this.props.task.activeIndex)(
            <Icon name="close" />,
          )}
        </Menu.Item>
      ),
      render: () => <Task task={item} url={this.props.task.upload.url} />,
    }));
  }

  startProcess() {
    this.props.actions.startTask(this.props.index);
  }

  render() {
    return (
      <div className="col-md-12 uploadCard">
        <Tab
          panes={this.getTabs()}
          menu={{ attached: true }}
          activeIndex={this.props.task.activeIndex}
          onTabChange={this.props.handleTabChange}
        />
      </div>
    );
  }
}

TabsContainer.propTypes = {
  task: PropTypes.object.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
export default TabsContainer;
