/* eslint-disable */
import autobind from 'auto-bind';
import { UPLOAD_SUCCESS, UPLOAD_FAILED, UPLOAD_LOGS, UPLOAD_PROGRESS } from '../../consts';

class UploadSocketListeners {
  constructor(socket, store) {
    this.socket = socket;
    this.mappedEventsHandlers = {};
    autobind(this);
  }

  mapEventsToHandlers() {
    this.mappedEventsHandlers = {
      [UPLOAD_PROGRESS]: this.onUploadProgress,
      [UPLOAD_LOGS]: this.onUploadLogs,
      [UPLOAD_FAILED]: this.onUploadFailed,
      [UPLOAD_SUCCESS]: this.onUploadSuccess
    };
    return this;
  }

  listen(cb) {
    [UPLOAD_PROGRESS, UPLOAD_LOGS, UPLOAD_FAILED, UPLOAD_SUCCESS].forEach((key) => {
      this.socket.on(key, cb(key));
    });
    return this;
  }

  onUploadProgress({ uuid, progress }) {
    console.log(uuid, progress);
    // this.store.dispatch(updateItemProgress(uuid, progress));
  }

  onUploadLogs({ type, message }) {
    // toast(message, type);
  }

  onUploadFailed({ uuid, message }) {
    // this.store.dispatch(taskProcessed(uuid));
    // this.store.dispatch(uploadItemFailed(uuid, message));
    this.processFiles(uuid);
    // toast(message, 'error');
  }

  onUploadSuccess({ uuid, result }) {
    // this.store.dispatch(taskProcessed(uuid));
    // this.store.dispatch(uploadItemSuccess(uuid, result));
    this.processFiles(uuid);
    // toast('1 File has been uploaded successfully.', 'success');
  }

  processFiles(uuid) {
    const state = this.store.getState();
    const taskIndex = state.task.tasksIndexes.get(uuid);
    const { mainIndex } = taskIndex;
    if (taskIndex && mainIndex !== undefined) {
      const task = state.task.tasks[mainIndex];
      if (task.activeIndex >= task.tabs.length - 1) {
        // this.store.dispatch(processStopped(mainIndex));
      } else {
        // this.store.dispatch(startTask(mainIndex));
        setTimeout(() => {
          // this.store.dispatch(changeActiveIndex(task.activeIndex + 1, mainIndex));
        }, 2000);
      }
    }
  }
}

export default UploadSocketListeners;
