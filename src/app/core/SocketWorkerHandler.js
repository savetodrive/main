import autobind from 'auto-bind';
import { message as m } from 'antd';
import startCase from 'lodash/fp/startCase';
import SocketWorker from '../../workers/socket.worker';
import { UPLOAD_SUCCESS, UPLOAD_FAILED, UPLOAD_LOGS, UPLOAD_PROGRESS } from '../../consts';
import { uploadItemSuccess, updateItemProgress, uploadItemFailed } from '../actions/taskActions';
import { updateUsedBytes } from '../actions';
import Notification from '../../components/Notification';

class SocketWorkerHandler {
  constructor(store) {
    autobind(this);
    this.worker = new SocketWorker();
    this.store = store;
  }

  listen() {
    this.worker.postMessage({
      type: 'init',
      data: {
        host: window.location.host,
      },
    });
    this.worker.onmessage = this.handleWorkerMessage;
  }

  handleWorkerMessage(message) {
    const { type, data } = message.data;
    switch (type) {
      case UPLOAD_SUCCESS:
        this.onUploadSuccess(data);
        break;
      case UPLOAD_LOGS:
        this.onUploadLogs(data);
        break;
      case UPLOAD_FAILED:
        this.onUploadFailed(data);
        break;
      case UPLOAD_PROGRESS:
        this.onUploadProgress(data);
        break;
      default:
        break;
    }
  }
  onUploadProgress({ uuid, progress }) {
    this.store.dispatch(updateItemProgress(uuid, progress));
  }

  onUploadLogs({ type, message }) {
    if (Notification[type]) {
      Notification[type](startCase(type), message);
    } else if (m[type] && message) {
      m[type](message);
    }
  }

  onUploadFailed({ uuid, message, usedBytes }) {
    // eslint-disable-line
    // this.store.dispatch(taskProcessed(uuid));
    this.store.dispatch(uploadItemFailed({ uuid }, message));
    this.store.dispatch(updateUsedBytes(usedBytes));
    // this.processFiles(uuid);
    // toast(message, 'error');
    m.error(message);
  }

  onUploadSuccess({ uuid, result, usedBytes }) {
    // eslint-disable-line
    // this.store.dispatch(taskProcessed(uuid));
    this.store.dispatch(uploadItemSuccess({ uuid }, result));
    console.log(usedBytes);
    this.store.dispatch(updateUsedBytes(usedBytes));
    // this.processFiles(uuid);
    // toast('1 File has been uploaded successfully.', 'success');
    m.success('1 File has been uploaded successfully.');
  }
}

export default SocketWorkerHandler;
