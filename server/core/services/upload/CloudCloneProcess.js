const Process = require('./Process');
const { PROCESS_TYPE } = require('../../Strings');

class CloudCloneProcess extends Process {
  constructor() {
    super();
    this.processType = PROCESS_TYPE.CLOUD_CLONE;
  }
  setSourceMeta(sourceMeta) {
    this.sourceMeta = sourceMeta;
  }
  setDestinationMeta(destinationMeta) {
    this.destinationMeta = destinationMeta;
  }
}
module.exports = CloudCloneProcess;
