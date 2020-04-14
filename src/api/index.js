/* eslint-disable no-template-curly-in-string */
export const AUTH_FACEBOOK_CALLBACK = '/auth/${service}/callback';
export const LOGIN = '/login';
export const REGISTER = '/register';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/new-password/${hash}';
export const PING_SERVICE = '/ping/${service}';
export const UPLOAD_FILE_TO_CLOUD = '/upload/${service}';
export const KILL_UPLOAD_TASK = '/kill/${processId}';
export const FETCH_TAGS = '/tags';
export const FETCH_URL_META = '/url/meta';
export const GET_PLANS = '/subscription/plans';

/* Auth api's where /api/auth will be append */
export const ME = '/me';
export const GET_BRAINTREE_CLIENT_TOKEN = '/payment/client-token';
export const SUBSCRIBE_PLAN = '/subscribe/plan/${planId}';
export const SUBSCRIPTIONS = '/subscriptions';
export const CANCEL_SUBSCRIPTION = '/subscription/cancel';
export const UPDATE_PAYMENT = '/payment/update';
export const FETCH_ACTIVITIES = '/uploads';
export const FETCH_STATISTICS = '/statistics';
export const FETCH_SERVICES = '/services';
export const FETCH_CONNECTIONS = '/connections';
export const REMOVE_CONNECTION = '/connections/${connectionId}';
export const PING_CONNECTION = '/connection/ping/${connectionId}';
export const AUTH_UPLOAD = '/upload';
export const UPLOADS_IN_QUEUE = '/uploads/queue';
export const FETCH_DIRECTORY = '/connections/${connectionId}/directory';
export const CLOUD_CLONE = '/cloud-clone';
export const FASTSPRING_SECURE_PAYLOAD = '/subscription/secure-data';
export const EXPLORE_TORRENT = '/torrent/explore';
export const COPY_TORRENT_ITEM_TO_CLOUD = '/torrent/copy';
export const PING_APP = '/ping';
export const VERIFY_ORDER_ID = '/subscription/verify-order/${orderId}';
