import dotProp from 'dot-prop-immutable';
import {
  ADD_NEW_UPLOAD_ITEM,
  UPLOAD_SUCCESS,
  UPLOAD_FAILED,
  CLOSE_UPLOAD_TASK,
  UPLOAD_PROGRESS,
  REMOVE_TASK_FROM_INDEX,
  LOCK_PROGRESS,
  UNLOCK_PROGRESS,
  REINDEX_ITEMS,
} from '../../consts';

const initialState = {
  index: new Map(),
  items: [],
  errors: [],
  isProgressLocked: false,
};

const isNotNullUndefined = uploadItemIndex => uploadItemIndex !== undefined && uploadItemIndex !== null;
export default function uploadReducer(state = initialState, action) {
  let newState = {};
  const items = state.items.slice();
  const { data } = action;
  let uploadItemIndex = null;
  if (action.uuid) {
    uploadItemIndex = state.index.get(action.uuid);
  }
  switch (action.type) {
    case ADD_NEW_UPLOAD_ITEM:
      state.index.set(data.uuid, items.push({ ...data, completed: null }) - 1);
      newState = { items };
      break;

    case UPLOAD_PROGRESS:
      if (!state.isProgressLocked && (uploadItemIndex !== undefined && uploadItemIndex !== null)) {
        newState = dotProp.set(state, `items.${uploadItemIndex}.progress`, action.progress);
      }
      break;

    case UPLOAD_FAILED:
      if (isNotNullUndefined(uploadItemIndex)) {
        newState = dotProp.set(state, `items.${uploadItemIndex}.completed`, false);
      }
      break;

    case UPLOAD_SUCCESS:
      if (isNotNullUndefined(uploadItemIndex)) {
        newState = dotProp.set(state, `items.${uploadItemIndex}.completed`, true);
      }
      break;

    case CLOSE_UPLOAD_TASK:
      newState = dotProp.delete(state, `items.${action.index}`);
      break;
    case REMOVE_TASK_FROM_INDEX:
      state.index.delete(action.uuid);
      break;
    case LOCK_PROGRESS:
      newState.isProgressLocked = true;
      break;
    case UNLOCK_PROGRESS:
      newState.isProgressLocked = false;
      break;
    case REINDEX_ITEMS:
      newState.index = new Map();
      state.items.forEach((item, index) => {
        newState.index.set(item.uuid, index);
      });
      break;
    default:
      newState = {};
      break;
  }
  return Object.assign({}, state, newState);
}
