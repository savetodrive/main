import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import React from 'react';
import startCase from 'lodash/fp/startCase';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import renderIf from 'render-if';
import autobind from 'auto-bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Row, Col, message, Input, Radio, Divider, Button, Spin, Modal } from 'antd';
import * as taskActions from '../actions/taskActions';
import { torrent, copyTorrentItemToCloud } from '../../Utils/ValidationRules';
import { postExploreTorrent, postCopyTorrentItemToCloud } from '../../api/app';
import Directory from '../../components/Directory';
import CloudCloneBoxContainer from '../containers/CloudCloneBoxContainer';
import TaskProgress from '../../components/tasks/TaskProgress';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

class TorrentToDrive extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.file = null;
    this.state = {
      activeFolder: null,
      selectedConnection: null,
      loadingTorrent: false,
      lastUploadedTorrent: null,
      visible: false,
      activeCopy: {},
      mover: {
        id: 'torrent',
        list: [],
      },
      torrent: {
        type: 'magnet',
        magnet: '',
        url: '',
        file: false,
      },
    };
  }
  onChange(event) {
    this.setState({
      torrent: { ...this.state.torrent, type: event.target.value },
    });
  }
  handleContentChange(torrentType) {
    return (event) => {
      this.setState({
        torrent: { ...this.state.torrent, [torrentType]: event.target.value, file: false },
      });
    };
  }
  handleLoadTorrent() {
    torrent
      .validate(this.state.torrent)
      .then(() => {
        this.setState({
          loadingTorrent: true,
        });
        const formdata = new FormData();
        Object.keys(this.state.torrent).forEach((key) => {
          formdata.append(key, this.state.torrent[key]);
        });
        if (this.file) {
          formdata.append('torrent_file', this.file);
        }
        postExploreTorrent(formdata)
          .then((response) => {
            const { data } = response;

            this.setState({
              lastUploadedTorrent: {
                type: data.type,
                identifier: data.identifier,
              },
              mover: {
                list: data.files,
                id: 'torrent',
              },
            });
          })
          .catch((err) => {
            console.log(err);
            message.error(err.message || 'Some problem occurred.');
          })
          .finally(() => {
            this.setState({
              loadingTorrent: false,
            });
          });
      })
      .catch((err) => {
        (err.errors || [err.message]).forEach((element) => {
          message.error(element);
        });
      });
  }
  handleFileChange(event) {
    this.setState({
      torrent: { ...this.state.torrent, file: true },
    });
    this.file = event.target.files[0]; // eslint-disable-line
  }

  copyTorrentItemToCloud(payload) {
    return postCopyTorrentItemToCloud(payload)
      .then(({ data }) => {
        this.props.taskActions.add([data]);
        const index = this.props.tasks.findIndex((item) => item.uuid === data.uuid);
        this.setState({
          activeCopy: {
            source: payload.source.name,
            destination: startCase(payload.destination.service_type),
          },
          visible: true,
          taskId: data.uuid,
          taskIndex: index, // eslint-disable-line
        });
      })
      .catch(({ message: m, response = { data: {} } }) => {
        this.setState({
          visible: false,
        });
        message.error(response.data.message || m);
      })
      .finally(() => {
        this.setState({
          loadingTorrent: false,
        });
      });
  }
  handleClone(data) {
    const source = {
      torrent: this.state.lastUploadedTorrent,
      ...data.item,
    };
    const destination = {
      activeFolder: this.state.activeFolder,
      connectionId: this.state.selectedConnection,
    };
    if (!destination.connectionId) {
      return message.error('Please select destination cloud service.');
    }
    const payload = {
      source,
      destination,
    };
    return copyTorrentItemToCloud
      .validate(payload)
      .then((result) => {
        this.copyTorrentItemToCloud(result);
      })
      .catch((err) => {
        message.error(err.message || 'Some problem occurred.');
      });
  }
  handleItemSelect(mover) {
    const self = this;
    const fn = (item) => {
      if (mover.id === 'cloud') {
        self.setState({
          activeFolder: {
            id: item.id || 'root',
          },
        });
      }
    };
    return fn.bind(this);
  }
  handleOnConnectionSelect(connectionId) {
    this.setState({
      selectedConnection: connectionId,
    });
  }
  hideModal() {
    this.setState({
      visible: false,
    });
  }
  renderUpload() {
    return <input type="file" ref={(el) => (this.inputFileEl = el)} accept=".torrent" onChange={this.handleFileChange.bind(this)} />; // eslint-disable-line
  }
  render() {
    const torrentType = this.state.torrent.type;
    const taskIndex = this.state.taskIndex > -1 ? this.state.taskIndex : this.props.tasks.findIndex((item) => item.uuid === this.state.taskId);
    return (
      <div>
        <Modal title={`Copying File ${this.state.activeCopy.source}`} visible={this.state.visible} onCancel={this.hideModal} footer={null}>
          {this.state.taskId && <TaskProgress task={this.props.tasks[taskIndex] || {}} />}
        </Modal>
        <Spin spinning={this.state.loadingTorrent}>
          <Row>
            <Col span={24}>
              <RadioGroup name="radiogroup" value={this.state.torrent.type} onChange={this.onChange}>
                <Radio value="magnet">Magnet URI</Radio>
                <Radio value="file">Upload Torrent File</Radio>
                <Radio value="url">Torrent URL</Radio>
              </RadioGroup>
              <br />
              {renderIf(torrentType === 'magnet')(
                <TextArea
                  value={this.state.torrent.magnet}
                  onChange={this.handleContentChange('magnet')}
                  placeholder="Enter magnet"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
              {renderIf(torrentType === 'url')(
                <Input value={this.state.torrent.url} onChange={this.handleContentChange('url')} placeholder="Enter URL" />,
              )}
              {renderIf(torrentType === 'file')(this.renderUpload())}
              <br />
              <Button type="primary" onClick={this.handleLoadTorrent}>
                Load
              </Button>
              <Divider />
              <Row>
                <Col span={12}>
                  <Directory handleClone={this.handleClone} mover={this.state.mover} handleItemSelect={this.handleItemSelect(this.state.mover)} />
                </Col>
                <Col span={12}>
                  <CloudCloneBoxContainer
                    onConnectionSelect={this.handleOnConnectionSelect}
                    handleClone={this.handleClone}
                    handleItemSelect={this.handleItemSelect({ id: 'cloud' })}
                    connections={this.props.connections}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}

TorrentToDrive.propTypes = {
  connections: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  taskActions: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  connections: state.app.connections,
  mover: state.mover,
  tasks: state.task.tasks,
});

const mapActionToProps = (dispatch) => ({
  taskActions: bindActionCreators({ ...taskActions }, dispatch),
});

export default DragDropContext(HTML5Backend)(
  withRouter(
    connect(
      mapStateToProps,
      mapActionToProps,
    )(TorrentToDrive),
  ),
);
