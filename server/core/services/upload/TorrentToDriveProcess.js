const CloudCloneProcess = require('./CloudCloneProcess');
const { PROCESS_TYPE } = require('../../Strings');

class TorrentToDrive extends CloudCloneProcess {
  constructor() {
    super();
    this.processType = PROCESS_TYPE.TORRENT_TO_DRIVE;
  }
}
module.exports = TorrentToDrive;
