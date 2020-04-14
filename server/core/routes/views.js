const strings = require('../Strings');
const guestController = require('../controllers/Guest');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const route404Middleware = require('../middlewares/route404Middleware');
const subscription = require('../middlewares/subscription');

module.exports = (router) => {
  router.get('/app/payment', authenticateMiddleware, (req, res) => {
    res.render('payment');
  });
  router.get('/app/on-authenticated', authenticateMiddleware, (req, res) => {
    res.render('app/on-authenticated');
  });

  if (global.app.get('env') === 'development') {
    router.get('/test/mail', (req, res) => {
      global.events.emit(strings.SEND_EMAIL, {
        to: req.query.to,
        subject: req.query.subject || 'Test',
        template: {
          name: strings.TEMPLATE_FOR_TEST,
          data: Object.assign(req.query, {
            test: 'test',
          }),
        },
      });
      res.status(200).send();
    });
    router.get('/test/template/:templateName', (req, res) => {
      res.render(`app/emailTemplates/${req.params.templateName}`, {
        user: {
          first_name: 'samundra',
          last_name: 'kc',
        },
        fpHash: 'test',
        hash: 'test',
        host: 'http://localhost:3001',
        url: 'http://www.goog.com',
        status: 'Completed',
        description: 'File upload success',
        id: '1',
        email: 'samundrak@yahoo.com',
        service: 'Google Drive',
        created_at: new Date(),
        end_at: new Date(),
        meta: {
          name: 'name',
          type: 'type',
        },
      });
    });
  }
  router.get('/app', authenticateMiddleware, subscription, guestController.app); // change it back to app
  router.get('/app/*', route404Middleware, authenticateMiddleware, subscription, guestController.app);
  router.get('/*', authCheckMiddleware, route404Middleware, guestController.home);

  return router;
};
