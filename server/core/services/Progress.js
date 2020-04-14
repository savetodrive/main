const speedometer = require('speedometer');
const prettysize = require('prettysize');
const prettyTime = require('pretty-time');

class Progress {
  constructor(length, emitDelay = 1000) {
    this.length = parseInt(length, 10) || 0;
    this.transferred = 0;
    this.speed = 0;
    this.streamSpeed = speedometer(this.speed || 5000);
    this.initial = false;
    this.emitDelay = emitDelay;
    this.eventStart = 0;
    this.percentage = 0;
  }

  setLength(length) {
    this.length = length;
  }

  setEmitDelay(emitDelay = 1000) {
    this.emitDelay = emitDelay;
  }

  getRemainingBytes() {
    return parseInt(this.length, 10) - parseInt(this.transferred, 10);
  }

  getEta() {
    return this.length >= this.transferred
      ? (this.getRemainingBytes() / this.speed) * 1000000000
      : 0;
  }

  flow(chunk, onProgress) {
    const chunkLength = chunk.length;
    this.transferred += chunkLength;
    this.speed = this.streamSpeed(chunkLength);
    this.percentage = Math.round((this.transferred / this.length) * 100);
    if (!this.initial) {
      this.eventStart = Date.now();
      this.initial = true;
    }
    if ((this.length === this.transferred)
      || (Date.now() - this.eventStart) > this.emitDelay) {
      this.eventStart = Date.now();

      onProgress({
        raw: {
          remaining: this.getRemainingBytes(),
          total: this.length,
          transferred: this.transferred,
          speed: this.speed,
          eta: this.getEta(),
          percentage: this.percentage,
        },
        pretty: {
          remaining: prettysize(this.getRemainingBytes()),
          total: prettysize(this.length),
          transferred: prettysize(this.transferred),
          speed: prettysize(this.speed),
          eta: prettyTime(this.getEta()) || 0,
          percentage: this.percentage,
        },
      });
    }
  }
}

module.exports = Progress;
