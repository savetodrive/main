const strings = require('../Strings');
const emailHandler = require('../handlers/events/email');
const uploadFileToCloud = require('../handlers/events/uploadFileToCloud');
const createSubscriptionCustomer = require('../handlers/events/createSubscriptionCustomer');

const event = global.events;

event.on(strings.SEND_EMAIL, emailHandler);
event.on(strings.UPLOAD_NEW_FILE, uploadFileToCloud);
event.on(strings.EVENT_ACCOUNT_ACTIVATED, createSubscriptionCustomer);
