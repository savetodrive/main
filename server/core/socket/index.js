const socket = require('socket.io');

module.exports = (server) => {
  const io = socket(server);
  io.on('connection', (client) => {
    global.socketClients.set(client.id, client);

    if (!client.handshake.session.sockets) {
      client.handshake.session.sockets = []; // eslint-disable-line
    }

    client.handshake.session.sockets.push(client.id);
    client.handshake.session.save();

    client.on('disconnect', () => {
      // session object could be outdated and could override the data persisted in other requests
      // so we reload the session data from the session store to obtain a fresh copy of session data
      // and make our changes accordingly
      client.handshake.session.reload(() => {
        global.socketClients.delete(client.id);
        const indexOfDeadSocket = client.handshake.session.sockets.indexOf(client.id);
        client.handshake.session.sockets.splice(indexOfDeadSocket, 1);
        client.handshake.session.save();
      });
    });
  });

  return io;
};
