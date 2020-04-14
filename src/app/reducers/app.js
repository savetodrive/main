/* eslint-disable no-case-declarations */
import dotProp from 'dot-prop-immutable';
import * as ACTIONS from '../../consts';

const serviceIndexes = new Map();
['google-drive', 'one-drive', 'dropbox', 'box'].forEach((service, index) => serviceIndexes.set(service, index));

const initialState = {
  uploads: [],
  connections: [],
  services: [],
  loading: {
    activities: false,
  },
  activities: [],
  statistics: {},
  plans: [],
  user: {
    first_name: '',
    last_name: '',
    email: '',
    sex: '',
    quota: {
      bytesUsed: 0,
    },
    subscription: {},
  },
  drives: [],
};
export default function appReducer(state = initialState, action) {
  let newState = {};
  let serviceIndex = -1;
  let connectionIndex = -1;
  if (action.service) {
    serviceIndex = serviceIndexes.get(action.service);
  }

  switch (action.type) {
    case ACTIONS.PING_CONNECTION:
      connectionIndex = state.connections.findIndex((connection) => connection._id === action.connectionId);
      if (connectionIndex > -1) {
        newState = dotProp.merge(state, `connections.${connectionIndex}`, action.data);
      } else {
        newState = dotProp.set(state, `connections`, [].concat(state.connections, [action.data]));
      }
      break;
    case ACTIONS.REMOVE_CONNECTION:
      connectionIndex = state.connections.findIndex((connection) => connection._id === action.connectionId);
      if (connectionIndex > -1) {
        newState = dotProp.delete(state, `connections.${connectionIndex}`);
      }
      break;
    case ACTIONS.FETCH_CONNECTIONS:
      newState = dotProp.set(state, 'connections', action.connections || []);
      break;
    case ACTIONS.FETCH_SERVICES:
      newState = dotProp.set(state, 'services', action.services);
      break;
    case ACTIONS.FETCH_USER_SUCCESS:
    case ACTIONS.USER_PROFILE_UPDATE_SUCCESS:
      newState = dotProp.merge(state, 'user', action.user);
      break;
    case ACTIONS.PING_SERVICE_SUCCESS:
      if (serviceIndex > -1) {
        newState = dotProp.merge(state, `drives.${serviceIndex}`, {
          user: action.user,
          status: true,
        });
      }

      break;
    case ACTIONS.PING_SERVICE_FAILED:
      if (serviceIndex > -1) {
        newState = dotProp.merge(state, `drives.${serviceIndex}`, {
          user: {},
          status: false,
        });
      }
      break;
    case ACTIONS.FETCH_ACTIVITIES_SUCCESS:
    case ACTIONS.FETCH_ACTIVITIES_FAILED:
      newState = dotProp.set(state, 'activities', action.activities || []);
      break;
    case ACTIONS.FETCH_STATISTICS_SUCCESS:
    case ACTIONS.FETCH_STATISTICS_FAILED:
      newState = dotProp.set(state, 'statistics', action.statistics || {});
      break;
    case ACTIONS.START_LOADING:
      newState = dotProp.set(state, `loading.${action.entity}`, true);
      break;
    case ACTIONS.STOP_LOADING:
      newState = dotProp.set(state, `loading.${action.entity}`, false);
      break;
    case ACTIONS.FETCH_PLANS_SUCCESS:
      newState = dotProp.set(state, 'plans', action.plans);
      break;
    case ACTIONS.ADD_UPLOAD_SNAPSHOT:
      newState = dotProp.set(state, 'uploads', [...state.uploads, action.upload]);
      break;
    case ACTIONS.UPDATE_USED_BYTES:
      newState = dotProp.set(state, 'user.quota.bytesUsed', state.user.quota.bytesUsed + action.bytes);
      break;
    case ACTIONS.UPDATE_SUBSCRIPTION:
      newState = dotProp.merge(state, 'user.subscription', action.data);
      break;
    default:
      newState = {};
      break;
  }

  return Object.assign({}, state, newState);
}
