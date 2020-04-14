const api = require('express').Router();
const cloudService = require('../../../controllers/CloudService');
const Payment = require('../../../controllers/PaymentController');
const SubscriptionController = require('../../../controllers/SubscriptionController');
const userController = require('../../../controllers/UserController');
const user = require('../../../controllers/UserController');
const connection = require('../../../controllers/Connection');
const subscription = require('../../../middlewares/subscription');
const requestBodyValidation = require('../../../middlewares/requestBodyValidation');
const CloudClone = require('../../../controllers/CloudClone');
const torrent = require('../../../controllers/Torrent');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');

const upload = multer({
  storage: multerS3({
    s3: global.s3,
    bucket: process.env.STORAGE_BUCKET_NAME,
    acl: 'public-read',
    key(request, file, cb) {
      cb(null, `${uuid(`${file.originalname}-${Date.now()}`)}.torrent`);
    },
  }),
});

api.get('/ping/:service', subscription, cloudService.ping);
api.get('/uploads', user.uploads);
api.get('/statistics', user.statistics);
api.get('/connections', connection.index);
api.get('/connections/:connectionId', connection.show);
api.post('/connections/:connectionId', connection.delete);
api.post('/connection/ping/:connectionId', connection.ping);
api.post('/upload', requestBodyValidation('upload'), cloudService.remoteUploads);
api.get('/uploads/queue', userController.uploadsInQueue);
api.post('/payment/update', Payment.update);
// api.get('/subscriptions/:subscriptionId', SubscriptionController.show);
// api.get('/customer', SubscriptionController.customer);
// api.get('/subscriptions', SubscriptionController.index);
api.post('/subscription/cancel', SubscriptionController.cancel);

api.get('/connections/:connection/directory', connection.listDirectory);
api.get('/connections/:connection/file/:fileId', connection.file);
api.post('/cloud-clone', requestBodyValidation('cloudClone'), CloudClone.clone);
api.post('/torrent/explore', upload.single('torrent_file'), torrent.explore);
api.post('/torrent/copy', requestBodyValidation('copyTorrentItemToCloud'), torrent.copyToCloud);
module.exports = api;
