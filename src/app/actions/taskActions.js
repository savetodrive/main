/* eslint-disable no-alert */
import flatten from 'lodash/fp/flatten';
import omit from 'lodash/fp/omit';
import * as CONST from '../../consts';
import { postUploadFileToService } from '../../api/app';

export function add(tasks) {
  return {
    type: CONST.ADD_UPLOAD_TASKS,
    tasks,
  };
}

export function changeActiveIndex(activeIndex, index) {
  return {
    type: CONST.CHANGE_ACTIVE_INDEX,
    activeIndex,
    index,
  };
}
export function processStarted(index) {
  return {
    type: CONST.PROCESS_STARTED,
    index,
  };
}
export function processStopped(index) {
  return {
    type: CONST.PROCESS_STOPPED,
    index,
  };
}
export function updateInnerTaskMeta({ index, innerTaskIndex, data }) {
  return {
    type: CONST.UPDATE_INNER_TASK_META,
    index,
    innerTaskIndex,
    data,
  };
}
export function indexTask(index, innerTaskIndex, uuid) {
  return {
    type: CONST.INDEX_TASK,
    index,
    innerTaskIndex,
    uuid,
  };
}
export function startTask(index) {
  return (dispatch, getState) => {
    const { tasks } = getState().task;
    const activeTask = tasks[index];
    const innerTasks = activeTask.tabs;
    const innerTaskIndex = innerTasks.findIndex((task) => !task.isProcessed);
    if (innerTaskIndex === undefined || innerTaskIndex === null) {
      return false;
    }
    const innerTask = innerTasks[innerTaskIndex];
    const payload = omit(['service', 'meta', 'errors'])(activeTask.upload);
    return postUploadFileToService(innerTask.service.service, payload)
      .then(({ data }) => {
        dispatch(updateInnerTaskMeta({ index, innerTaskIndex, data }));
        dispatch(indexTask(index, innerTaskIndex, data.uuid));
      })
      .catch((error) => {
        dispatch(processStopped(index));
        try {
          const response = error.response.data;
          if (response.errors) {
            const messages = flatten(Object.values(response.errors));
            return messages.forEach((message) => alert(message));
          }
          return alert(error.response.data.message);
        } catch (err) {
          return alert('Some error occurred, please try again.');
        }
      });
  };
}
export function updateItemProgress(uuid, progress) {
  return {
    type: CONST.UPLOAD_PROGRESS,
    uuid,
    progress,
  };
}
export function uploadItemFailed({ uuid, usedBytes }, message) {
  return {
    type: CONST.UPLOAD_FAILED,
    uuid,
    usedBytes,
    message,
  };
}
export function uploadItemSuccess({ uuid, usedBytes }, result) {
  return {
    type: CONST.UPLOAD_SUCCESS,
    uuid,
    usedBytes,
    result,
  };
}
export function taskProcessed(uuid) {
  return {
    type: CONST.TASK_PROCESSED,
    uuid,
  };
}
