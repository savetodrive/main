/* eslint-disable no-restricted-globals */
/* global self */
import UploadSocketListeners from '../app/core/UploadSocketListeners';
import Socket from '../Utils/Socket';

let socket = null;
let socketUploadHandler = null;

const send = self.postMessage;
// prettier-ignore
self.addEventListener('message', (message) => { // eslint-disable-line
  const { type, data } = message.data;
  switch (type) {
    case 'init':
      socket = new Socket(data.host);
      socketUploadHandler = new UploadSocketListeners(socket);
      socketUploadHandler.listen((key) => (uploadData) => {
        send({ type: key, data: uploadData });
      });
      break;
    default:
      break;
  }
});
