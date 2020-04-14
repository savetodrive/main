import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import uuid from 'uuid';
import { message } from 'antd';
import CloudCloneBox from '../../components/CloudCloneBox';
import TreeIndex from '../stores/TreeIndex';
import { fetchDirectory as fetchDirectoryCall } from '../../api/app';

const indexes = TreeIndex.get();
class CloudCloneBoxContainer extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false,
      mover: {
        id: uuid(),
        tree: [],
        activeFolder: { name: 'Home', id: 'root' },
        connection: {
          _id: null,
        },
        list: [],
      },
    };
  }
  componentWillMount() {
    indexes.clear();
  }
  componentWillUnmount() {
    indexes.clear();
  }
  getParents(connectionIndex) {
    const search = (id, tree = []) => {
      if (id === 'root') return tree;
      const current = connectionIndex.get(id);
      if (!current) return tree;
      const { parent } = current;
      tree.unshift(parent);
      return search(parent.id, tree);
    };
    return search;
  }
  filterConnection() {
    const { mover } = this.state;
    return this.props.connections.filter((connection) => mover.connection._id === connection._id);
  }
  handleFetchDirectorySuccess({
    connectionId,
    directory,
    folderId = 'root',
    item, // item is clicked item on directory
  }) {
    if (!indexes.has(connectionId)) {
      indexes.set(connectionId, new Map());
    }

    const connectionIndex = indexes.get(connectionId);
    if (!connectionIndex.has(folderId)) {
      connectionIndex.set(folderId, {
        parent: this.state.mover.activeFolder,
        items: directory,
      });
    }
    const mover = { ...this.state.mover };
    mover.list = connectionIndex.get(folderId).items;
    if (item) {
      mover.activeFolder = item;
    }
    mover.tree = this.getParents(connectionIndex)(folderId) || [];
    this.setState({
      mover,
    });
  }
  handleItemSelect(item) {
    return () => {
      this.props.handleItemSelect(item);
      this.fetchDirectory({ connectionId: this.state.mover.connection._id, params: { folderId: item.id }, item });
    };
  }
  fetchDirectory({ connectionId, params = { folderId: 'root' }, item: clickedItem }) {
    const con = indexes.get(connectionId);
    this.setState({
      mover: { ...this.state.mover, connection: this.props.connections.find((item) => item._id === connectionId) },
    });
    if (!con || !con.get(params.folderId)) {
      this.setState({
        loading: true,
      });
      params.folderId = params.folderId === 'root' ? undefined : params.folderId; // eslint-disable-line
      this.props.handleItemSelect({ id: params.folderId });
      return fetchDirectoryCall(connectionId, params)
        .then(({ data }) => {
          this.handleFetchDirectorySuccess({
            connectionId,
            directory: data,
            folderId: params.folderId,
            item: clickedItem,
          });
        })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    }
    return this.handleFetchDirectorySuccess({
      connectionId,
      directory: con.get(params.folderId).items,
      folderId: params.folderId,
      item: clickedItem,
    });
  }
  handleConnectionSelect(connectionId) {
    this.fetchDirectory({ connectionId });
    this.props.onConnectionSelect(connectionId);
  }

  render() {
    return (
      <CloudCloneBox
        disableDragging
        handleClone={this.props.handleClone}
        handleItemSelect={this.handleItemSelect}
        mover={this.state.mover}
        connections={this.props.connections}
        handleConnectionSelect={this.handleConnectionSelect}
        loading={this.state.loading}
      />
    );
  }
}

CloudCloneBoxContainer.propTypes = {
  connections: PropTypes.array.isRequired,
  handleClone: PropTypes.func.isRequired,
  handleItemSelect: PropTypes.func.isRequired,
  onConnectionSelect: PropTypes.func.isRequired,
};
export default CloudCloneBoxContainer;
