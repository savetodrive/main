import { fetchStatistics, fetchActivities, getMe, getServices, getConnections, getPingConnection, getAllPlans } from '../../api/app';
import * as CONST from '../../consts';

export function auth() {
  return () => new Promise((resolve) => getMe().then((response) => resolve(response.data)));
}

export function redirectToApp() {
  window.location.href = CONST.APP_PATH;
}

export function fetchUserDetailsSuccess(user) {
  return {
    type: CONST.FETCH_USER_SUCCESS,
    user,
  };
}

export function fetchActivitiesSuccess(activities) {
  return {
    type: CONST.FETCH_ACTIVITIES_SUCCESS,
    activities,
  };
}

export function fetchActivitiesFailed() {
  return {
    type: CONST.FETCH_ACTIVITIES_FAILED,
  };
}

export function fetchStatisticsSuccess(statistics) {
  return {
    type: CONST.FETCH_STATISTICS_SUCCESS,
    statistics,
  };
}

export function fetchStatisticsFailed() {
  return {
    type: CONST.FETCH_STATISTICS_FAILED,
  };
}

export function startLoading(entity) {
  return {
    type: CONST.START_LOADING,
    entity,
  };
}

export function stopLoading(entity) {
  return {
    type: CONST.STOP_LOADING,
    entity,
  };
}

export function getActivites(query) {
  return (dispatch) => {
    dispatch(startLoading('activities'));
    fetchActivities(query)
      .then((response) => {
        dispatch(fetchActivitiesSuccess(response.data));
      })
      .catch(() => dispatch(fetchActivitiesFailed()))
      .finally(() => {
        dispatch(stopLoading('activities'));
      });
  };
}

export function getStatistics() {
  return (dispatch) => {
    fetchStatistics({})
      .then((response) => {
        dispatch(fetchStatisticsSuccess(response.data));
      })
      .catch(() => {
        dispatch(fetchActivitiesFailed());
      });
  };
}

export function fetchServicesSuccessfull(services) {
  return {
    type: CONST.FETCH_SERVICES,
    services,
  };
}
export function fetchServices() {
  return (dispatch) => {
    getServices().then(({ data }) => {
      dispatch(fetchServicesSuccessfull(data));
    });
  };
}
export function fetchConnectionSuccss(connections) {
  return {
    type: CONST.FETCH_CONNECTIONS,
    connections,
  };
}
export function fetchConnections() {
  return (dispatch) => {
    getConnections().then(({ data }) => {
      dispatch(fetchConnectionSuccss(data));
    });
  };
}
export function removeConnection(connectionId) {
  return {
    type: CONST.REMOVE_CONNECTION,
    connectionId,
  };
}
export function updateConnection(connectionId, data) {
  return {
    type: CONST.PING_CONNECTION,
    connectionId,
    data,
  };
}
export function pingConnection(connectionId) {
  return (dispatch) =>
    getPingConnection(connectionId)
      .then(() => {
        dispatch(updateConnection(connectionId, { status: true }));
      })
      .catch(() => {
        dispatch(updateConnection(connectionId, { status: false }));
        throw new Error();
      });
}

export function fetchPlansSuccess(plans) {
  return {
    type: CONST.FETCH_PLANS_SUCCESS,
    plans,
  };
}
export function fetchPlan() {
  return (dispatch) =>
    getAllPlans().then(({ data }) => {
      dispatch(fetchPlansSuccess(data));
    });
}
export function addUploadSnapshot(upload) {
  return {
    type: CONST.ADD_UPLOAD_SNAPSHOT,
    upload,
  };
}
export function updateUsedBytes(bytes) {
  return {
    type: CONST.UPDATE_USED_BYTES,
    bytes,
  };
}
export function updateSubscription(data) {
  return {
    type: CONST.UPDATE_SUBSCRIPTION,
    data,
  };
}
