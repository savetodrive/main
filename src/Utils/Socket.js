import io from 'socket.io-client';

class Socket {
  constructor(host) {
    this.io = io.connect(host);
  }

  on(event, handler) {
    this.io.on(event, handler);
  }

  emit(event, data) {
    this.io.emit(event, data);
  }
}

export default Socket;
