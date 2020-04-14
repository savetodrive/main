import * as CONST from '../../consts';
import { getUrlMeta } from '../../api/app';

export function updateConnections(connections) {
  return {
    type: CONST.UPDATE_CONNECTIONS,
    connections,
  };
}

export function toggleFileName() {
  return {
    type: CONST.TOGGLE_FILENAME,
  };
}
export function toggleEmail() {
  return {
    type: CONST.TOGGLE_EMAIL,
  };
}

export function updateFilename(filename) {
  return {
    type: CONST.UPDATE_FILENAME,
    filename,
  };
}
export function updateEmail(email) {
  return {
    type: CONST.UPDATE_EMAIL,
    email,
  };
}

export function addUploadMeta(meta) {
  return {
    type: CONST.ADD_UPLOAD_META,
    meta,
  };
}
export function removeUploadMeta() {
  return {
    type: CONST.REMOVE_UPLOAD_META,
  };
}
export function updateErrors(errors) {
  return {
    type: CONST.UPDATE_ERRORS,
    errors,
  };
}
export function onGetUrlMetaSuccess(meta) {
  return {
    type: CONST.FETCH_URL_META_SUCCESS,
    meta,
  };
}
export function onGetUrlMetaFailed() {
  return {
    type: CONST.FETCH_URL_META_FAILED,
  };
}

export function fetchUrlMeta(url) {
  return (dispatch) =>
    getUrlMeta(url)
      .then((response) => dispatch(onGetUrlMetaSuccess(response.data)))
      .catch(() => dispatch(onGetUrlMetaFailed()));
}
export function addNewUrlField() {
  return {
    type: CONST.ADD_NEW_URL_FIELD,
  };
}
export function removeUrlField(id) {
  return {
    id,
    type: CONST.REMOVE_URL_FIELD,
  };
}

export function updateUrl(url, id) {
  return {
    type: CONST.UPDATE_URL,
    url,
    id,
  };
}
export function clear() {
  return {
    type: CONST.CLEAR,
  };
}
