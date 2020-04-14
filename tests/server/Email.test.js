require('./global');
const Email = require('../../server/core/services/email/Email');

describe('Testing Email service', () => {
  let email = null;

  beforeAll(() => {
    email = new Email();
    email.setTo('samundra.kc6@gmail.com');
    email.setMessage('Test mail');
    email.setSubject('This is test mail');
  });

  it('should send email', (done) => {
    email.send(done);
  });
});
