const TagModel = require('../server/core/model/Tag');

class Tag {
  constructor() {
    this.data = [{ text: 'movie' }, { text: 'software' }, { text: 'game' }, { text: 'song' }, { text: 'file' }];
  }

  run() {
    return TagModel.collection.insert(this.data);
  }
}

module.exports = Tag;
