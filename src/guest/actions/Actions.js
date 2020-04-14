import flatten from 'lodash/fp/flatten';
import startCase from 'lodash/fp/startCase';
import toastr from '../../Utils/Toast';
import {
  ADD_NEW_UPLOAD_ITEM,
  STORE_TOKEN,
  UPLOAD_SUCCESS,
  UPLOAD_FAILED,
  CLOSE_UPLOAD_TASK,
  UPLOAD_PROGRESS,
  REMOVE_TASK_FROM_INDEX,
  LOCK_PROGRESS,
  UNLOCK_PROGRESS,
  REINDEX_ITEMS,
} from '../../consts';
import { postUploadFileToService, killUploadTask } from '../../api/guest';

export function storeToken(token) {
  return {
    type: STORE_TOKEN,
    token,
  };
}

export function addNewUploadItem(data) {
  return {
    type: ADD_NEW_UPLOAD_ITEM,
    data,
  };
}

export function uploadFile({ service, data }) {
  return (dispatch) =>
    postUploadFileToService(service, data)
      .then((response) => {
        dispatch(addNewUploadItem(Object.assign({ service, serviceLabel: startCase(service) }, response.data)));
        return response.data;
      })
      .catch((error) => {
        try {
          const response = error.response.data;
          if (response.errors) {
            const messages = flatten(Object.values(response.errors));
            return messages.forEach((message) => toastr(message, 'error'));
          }
          return toastr(error.response.data.message, 'error');
        } catch (err) {
          return toastr('Some error occurred, please try again.', error);
        }
      });
}

export function updateItemProgress(uuid, progress) {
  return {
    type: UPLOAD_PROGRESS,
    uuid,
    progress,
  };
}

export function uploadItemFailed(uuid, message) {
  return {
    type: UPLOAD_FAILED,
    uuid,
    message,
  };
}

export function uploadItemSuccess(uuid, result) {
  return {
    type: UPLOAD_SUCCESS,
    uuid,
    result,
  };
}

export function removeTaskFromIndex(uuid) {
  return {
    type: REMOVE_TASK_FROM_INDEX,
    uuid,
  };
}

export function lockProgress() {
  return {
    type: LOCK_PROGRESS,
  };
}

export function unlockProgress() {
  return {
    type: UNLOCK_PROGRESS,
  };
}

export function killUploadingTask(uuid) {
  return (dispatch) =>
    killUploadTask(uuid)
      .then(() => {
        toastr('1 Task has been aborted.', 'error');
        dispatch(uploadItemFailed(uuid));
      })
      .catch((err) => toastr(err.response.data.message, 'error'));
}

export function removeUploadedTask(uuid, index) {
  return {
    type: CLOSE_UPLOAD_TASK,
    uuid,
    index,
  };
}

export function reindexItems() {
  return {
    type: REINDEX_ITEMS,
  };
}
