import dotProp from 'dot-prop-immutable';
import cloneDeep from 'lodash/fp/cloneDeep';
import uuid from 'uuid';
import * as CONST from '../../consts';

const baseState = {
  urls: [
    {
      value: '',
      id: uuid(),
    },
  ],
  isFilename: false,
  isEmail: false,
  filename: '',
  email: '',
  connections: [],
  advanceSettings: [
    {
      name: 'Basic Auth',
      fields: [{ key: 'username', value: '' }, { key: 'password', value: '' }],
    },
  ],
};
const baseStateCopy = cloneDeep(baseState);
export default function uploadReducer(state = baseState, action) {
  let index = -1;
  let newState = {};
  switch (action.type) {
    case CONST.ADD_UPLOAD_META:
      newState.meta = action.meta;
      break;
    case CONST.REMOVE_UPLOAD_META:
      newState.meta = null;
      break;
    case CONST.UPDATE_CONNECTIONS:
      newState = dotProp.set(state, 'connections', action.connections);
      break;
    case CONST.TOGGLE_FILENAME:
      newState = dotProp.set(state, 'isFilename', !state.isFilename);
      break;
    case CONST.TOGGLE_EMAIL:
      newState = dotProp.set(state, 'isEmail', !state.isEmail);
      break;
    case CONST.UPDATE_FILENAME:
      newState = dotProp.set(state, 'filename', action.filename);
      break;
    case CONST.UPDATE_EMAIL:
      newState = dotProp.set(state, 'email', action.email);
      break;
    case CONST.ADD_SERVICE:
      newState = dotProp.set(state, 'services', (service) => [...service, action.service]);
      break;
    case CONST.REMOVE_SERVICE:
      newState = dotProp.delete(state, `services.${action.index}`);
      break;
    case CONST.UPDATE_ERRORS:
      newState = dotProp.merge(state, 'errors', action.errors);
      break;
    case CONST.FETCH_URL_META_SUCCESS:
      newState = dotProp.set(state, 'meta', action.meta);
      break;
    case CONST.FETCH_URL_META_FAILED:
      newState = dotProp.set(state, 'meta', null);
      break;
    case CONST.ADD_NEW_URL_FIELD:
      newState = dotProp.set(state, 'urls', [...state.urls, { url: '', id: uuid() }]);
      break;
    case CONST.REMOVE_URL_FIELD:
      index = state.urls.findIndex((url) => url.id === action.id);
      if (index > -1) {
        newState = dotProp.delete(state, `urls.${index}`);
      }
      break;
    case CONST.UPDATE_URL:
      index = state.urls.findIndex((url) => url.id === action.id);
      if (index > -1) {
        newState = dotProp.set(state, `urls.${index}.value`, action.url);
      }
      break;
    case CONST.CLEAR:
      newState = cloneDeep(baseStateCopy);
      break;
    default:
      newState = {};
      break;
  }

  return Object.assign({}, state, newState);
}
