class UploadableFile {
  constructor(filename, size, path) {
    this.filename = filename;
    this.size = size;
    this.path = path;
  }
}

module.exports = UploadableFile;
