import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import startCase from 'lodash/fp/startCase';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import autobind from 'auto-bind';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Row, Col, message, Modal, Spin, Card } from 'antd';
import CloudCloneBox from '../../components/CloudCloneBox';
import { selectMoverConnection, fetchDirectory, fetchDirectorySuccess } from '../actions/moverActions';
import { postCloudClone } from '../../api/app';
import * as taskActions from '../actions/taskActions';
import TaskProgress from '../../components/tasks/TaskProgress';

class CloudClone extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: {},
      visible: false,
      isLoading: false,
      taskId: null,
      taskIndex: -1,
      activeCopy: {},
    };
  }
  handleConnectionSelect(mover) {
    return (connectionId) => {
      //   if (!mover.conenction) return false;
      const connection = this.props.connections.find((item) => item._id === connectionId);
      if (!connection) return;
      this.moverLoading(mover.id);
      this.props.actions.selectMoverConnection({
        moverId: mover.id,
        connection,
      });
      this.props.actions
        .fetchDirectory({ connectionId, moverId: mover.id }, { folderId: '' })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          this.moverLoading(mover.id);
        });
    };
  }

  handleClone(source, destination) {
    const sourceMover = this.props.mover.items.find((m) => m.id === source.source);
    const destinationMover = this.props.mover.items.find((m) => m.id === destination);
    if (!sourceMover.connection._id || !destinationMover.connection._id) return;
    const payload = {
      source: {
        connectionId: sourceMover.connection._id,
        item: source.item,
        activeFolder: sourceMover.activeFolder,
      },
      destination: {
        connectionId: destinationMover.connection._id,
        activeFolder: destinationMover.activeFolder,
      },
    };
    this.setState({
      isLoading: true,
    });
    postCloudClone(payload)
      .then(({ data }) => {
        this.props.taskActions.add([data]);
        const index = this.props.tasks.findIndex((item) => item.uuid === data.uuid);
        this.setState({
          activeCopy: {
            source: startCase(sourceMover.connection.service_type),
            destination: startCase(destinationMover.connection.service_type),
          },
          visible: true,
          isLoading: false,
          taskId: data.uuid,
          taskIndex: index,
        });
      })
      .catch(({ message: m, response = { data: {} } }) => {
        this.setState({
          visible: false,
          isLoading: false,
        });
        message.error(response.data.message || m);
      });
  }
  moverLoading(moverId) {
    this.setState({
      loading: {
        ...this.state.loading,
        [moverId]: !this.state.loading[moverId],
      },
    });
  }
  handleItemSelect(mover) {
    return (item) => () => {
      const moverBox = this.props.mover.items.find((m) => m.id === mover.id);
      if (!moverBox) return;
      if (item.type === 'file') return;
      this.moverLoading(mover.id);
      this.props.actions
        .fetchDirectory({ connectionId: moverBox.connection._id, moverId: mover.id, item }, { folderId: item.id })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          this.moverLoading(mover.id);
        });
    };
  }
  filterConnection(mover) {
    return this.props.connections.filter(
      (connection) =>
        // dizs
        mover.connection._id === connection._id || !this.props.mover.items.find((item) => item.connection._id === connection._id),
    );
  }
  hideModal() {
    this.setState({
      visible: false,
    });
  }
  render() {
    const taskIndex = this.state.taskIndex > -1 ? this.state.taskIndex : this.props.tasks.findIndex((item) => item.uuid === this.state.taskId);
    return (
      <div>
        <Card title="Cloud Clone">
          <Modal
            title={`Copying File from ${this.state.activeCopy.source} to ${this.state.activeCopy.destination}`}
            visible={this.state.visible}
            onCancel={this.hideModal}
            footer={null}
          >
            {this.state.taskId && <TaskProgress task={this.props.tasks[taskIndex] || {}} />}
          </Modal>
          <Spin spinning={this.state.isLoading}>
            <Row>
              {this.props.mover.items.map((mover, index) => (
                <Col span={12} key={mover.id}>
                  <CloudCloneBox
                    cloneBoxId={index}
                    handleClone={this.handleClone}
                    handleItemSelect={this.handleItemSelect(mover)}
                    mover={mover}
                    connections={this.filterConnection(mover)}
                    handleConnectionSelect={this.handleConnectionSelect(mover)}
                    loading={this.state.loading[mover.id]}
                  />
                </Col>
              ))}
            </Row>
          </Spin>
        </Card>
      </div>
    );
  }
}
CloudClone.propTypes = {
  connections: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  mover: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  taskActions: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  connections: state.app.connections,
  mover: state.mover,
  tasks: state.task.tasks,
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ selectMoverConnection, fetchDirectory, fetchDirectorySuccess }, dispatch),
  taskActions: bindActionCreators({ ...taskActions }, dispatch),
});

export default DragDropContext(HTML5Backend)(
  withRouter(
    connect(
      mapStateToProps,
      mapActionToProps,
    )(CloudClone),
  ),
);
