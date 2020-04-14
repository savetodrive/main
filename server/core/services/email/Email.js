const email = require('emailjs');

const {
  email: {
    user, password, host, port, from,
  },
} = global.config();

class Email {
  constructor() {
    this.to = undefined;
    this.from = from;
    this.subject = undefined;
    this.message = ' ';
    this.content = undefined;
    this.init();
  }

  getTo() {
    return this.to;
  }

  getFrom() {
    return this.from || 'no-reply@savetodrive.net';
  }

  getSubject() {
    return this.subject;
  }

  getMessage() {
    return this.message;
  }

  setTo(to) {
    this.to = to;
    return this;
  }

  setFrom(sender) {
    this.from = sender;
    return this;
  }

  setSubject(subject) {
    this.subject = subject;
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  init() {
    this.server = email.server.connect({
      user,
      password,
      host,
      port,
      tls: true,
    });
  }

  setContent(content) {
    this.content = content;
    return this;
  }

  send(cb) {
    const self = this;
    const payload = {
      text: self.getMessage(),
      from: self.getFrom(),
      to: self.getTo(),
      subject: self.getSubject(),
    };

    if (this.content) {
      payload.attachment = [{ data: self.content, alternative: true }];
    }
    this.server.send(payload, (err, message) => {
      if (cb) cb(err, message);
      if (err) {
        return global.logger.error(err);
      }

      return true;
    });
  }
}

module.exports = Email;
