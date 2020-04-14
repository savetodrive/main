import dotProp from 'dot-prop-immutable';
import uuid from 'uuid';
import * as ACTIONS from '../../consts';
import TreeIndex from '../stores/TreeIndex';

const indexes = TreeIndex.get();
const baseState = {
  items: [
    {
      id: uuid(),
      connection: {
        _id: null,
      },
      activeFolder: { name: 'Home', id: 'root' },
      list: [],
      tree: [],
    },
    {
      id: uuid(),
      tree: [],
      activeFolder: { name: 'Home', id: 'root' },
      connection: {
        _id: null,
      },
      list: [],
    },
  ],
};
function getParents(connectionIndex) {
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
export default function moverReducer(state = baseState, action) {
  let newState = {};
  let index = -1;
  let connectionIndex = null;
  let folderId = 'root';

  switch (action.type) {
    case ACTIONS.SELECT_MOVER_CONNECTION:
      index = state.items.findIndex((item) => item.id === action.moverId);
      if (index > -1) {
        newState = dotProp.set(state, `items.${index}.connection`, action.connection);
        newState.activeFolder = { name: 'Home', id: 'root' };
      }
      break;
    case ACTIONS.FETCH_DIRECTORY_SUCCESS:
      index = state.items.findIndex((item) => item.id === action.moverId);
      if (index > -1) {
        if (!indexes.has(action.connectionId)) {
          indexes.set(action.connectionId, new Map());
        }

        connectionIndex = indexes.get(action.connectionId);
        folderId = action.params.folderId || 'root';
        if (!connectionIndex.has(folderId)) {
          connectionIndex.set(folderId, {
            parent: state.items[index].activeFolder,
            items: action.directory,
          });
        }
        newState = dotProp.set(state, `items.${index}.list`, connectionIndex.get(folderId).items);
        if (action.item) {
          newState.items[index].activeFolder = action.item;
        }
        newState.items[index].tree = getParents(connectionIndex)(folderId) || [];
      }
      break;
    default:
      break;
  }
  return Object.assign({}, state, newState);
}
