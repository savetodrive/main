const capitalize = require('lodash/fp/capitalize');
const Email = require('../../services/email/Email');

module.exports = ({
  to, from = null, subject, message, template = null,
}) => {
  const email = new Email();
  email
    .setTo(to)
    .setSubject(capitalize(subject))
    .setMessage(message);

  if (from) {
    email.setFrom(from);
  }

  const dispatchMessage = `New Email has been dispatched to ${to} with subject ${subject}.`;
  if (template) {
    global.app.render(
      template.name,
      Object.assign(
        {},
        {
          host: process.env.FRONTEND_APP_HOST,
        },
        template.data,
      ),
      (error, html) => {
        if (error) {
          global.logger.error(subject, error, { to, subject });
          return false;
        }

        global.logger.info(dispatchMessage);
        email.setContent(html);
        return email.send();
      },
    );
  } else {
    global.logger.info(dispatchMessage);
    email.send();
  }
};
