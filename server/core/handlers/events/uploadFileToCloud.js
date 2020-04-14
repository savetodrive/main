module.exports = ({ uploadProcess }) => {
  global.queue.handleUploadRequests(uploadProcess);
};
