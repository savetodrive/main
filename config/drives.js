const isProd = process.env.NODE_ENV === 'production';
const REDIRECT_FRONTEND_HOST = process.env.FRONTEND_APP_HOST;
const { APP_HOST } = process.env;

const REDIRECT_URI = isProd ? `${APP_HOST}/token` : `${REDIRECT_FRONTEND_HOST}/token`;

module.exports = {
  drives: {
    googleDrive: [
      {
        host: 'https://www.googleapis.com/drive/v3/',
        scopes: [
          'https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.appdata',
          'https://www.googleapis.com/auth/drive.metadata',
          'https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.photos.readonly',
          'https://www.googleapis.com/auth/drive.readonly',
        ],
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: 'summer-foundry-125411',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${REDIRECT_URI}/google-drive`,
        public_redirect_uri: `${REDIRECT_URI}/google-drive/public`,
        javascript_origins: ['http://localhost:3001'],
      },
    ],
    dropbox: [
      {
        client_id: process.env.DROPBOX_CLIENT_KEY,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
        public_redirect_uri: `${REDIRECT_URI}/dropbox`,
        redirect_uri: `${REDIRECT_URI}/dropbox/public`,
      },
    ],
    oneDrive: [
      {
        client_id: '570beaeb-1e7f-4b19-a61b-1bc146a3691e',
        redirect_uri: `${REDIRECT_URI}/one-drive`,
        scopes: ['onedrive.readwrite', 'onedrive.readonly', 'offline_access', 'onedrive.appfolder'],
      },
    ],
    box: [
      {
        client_id: process.env.BOX_CLIENT_ID,
        client_secret: process.env.BOX_CLIENT_SECRET,
        public_redirect_uri: `${REDIRECT_URI}/box`,
        redirect_uri: `${REDIRECT_URI}/box/public`,
      },
    ],
    pcloud: [
      {
        client_id: process.env.PCLOUD_CLIENT_ID,
        client_secret: process.env.PCLOUD_CLIENT_SECRET,
        public_redirect_uri: `${REDIRECT_URI}/pcloud/public`,
        redirect_uri: `${REDIRECT_URI}/pcloud/public`,
        api: {
          upload: 'https://api.pcloud.com/uploadfile',
          user: 'https://api.pcloud.com/userinfo',
          auth: 'https://my.pcloud.com/oauth2/authorize',
          accessToken: 'https://api.pcloud.com/oauth2_token',
          listFolder: 'https://api.pcloud.com/listfolder',
          fileMeta: 'https://api.pcloud.com/getfilehistory',
        },
      },
    ],
    youtube: [
      {
        host: 'https://www.googleapis.com/youtube/v3/',
        client_id: process.env.YOUTUBE_CLIENT_ID,
        project_id: 'youtube-playgraam',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        javascript_origins: ['http://localhost:3001', 'https://s3.savetodrive.net'],
        redirect_uri: `${REDIRECT_URI}/youtube`,
        public_redirect_uri: `${REDIRECT_URI}/youtube/public`,
        scopes: [
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube.force-ssl',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/youtube.readonly',
        ],
      },
    ],
    yandexDisk: [
      {
        client_id: process.env.YANDEX_DISK_CLIENT_ID,
        client_secret: process.env.YANDEX_DISK_CLIENT_SECRET,
        redirect_uri: `${REDIRECT_URI}/yandex-disk`,
        public_redirect_uri: `${REDIRECT_URI}/yandex-disk/public`,
        api: {
          upload: 'https://api.pcloud.com/uploadfile',
          user: 'https://webdav.yandex.com/?userinfo',
          auth: 'https://oauth.yandex.com/authorize',
          accessToken: 'https://api.pcloud.com/oauth2_token',
          refreshToken: 'https://oauth.yandex.com/token',
          listFolder: 'https://cloud-api.yandex.net/v1/disk/resources',
        },
      },
    ],
    vimeo: [
      {
        client_id: process.env.VIMEO_CLIENT_ID,
        client_secret: process.env.VIMEO_CLIENT_SECRET,
        redirect_uri: `${REDIRECT_URI}/vimeo`,
        public_redirect_uri: `${REDIRECT_URI}/vimeo/public`,
        scopes: ['upload', 'create'],
        api: {
          auth: 'https://api.vimeo.com/oauth/authorize',
          accessToken: 'https://api.vimeo.com/oauth/access_token',
        },
      },
    ],
    dailymotion: [
      {
        client_id: process.env.DAILYMOTION_CLIENT_ID,
        client_secret: process.env.DAILYMOTION_CLIENT_SECRET,
        redirect_uri: `${REDIRECT_URI}/dailymotion`,
        public_redirect_uri: `${REDIRECT_URI}/dailymotion/public`,
        scopes: ['userinfo', 'manage_videos'],
        api: {
          auth: 'https://www.dailymotion.com/oauth/authorize',
          accessToken: 'https://api.dailymotion.com/oauth/token',
          user: 'https://api.dailymotion.com/auth',
          refreshToken: 'https://api.dailymotion.com/oauth/token',
        },
      },
    ],
    twitch: [
      {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        redirect_uri: `${REDIRECT_URI}/twitch`,
        public_redirect_uri: `${REDIRECT_URI}/twitch/public`,
        scopes: ['user:read:email', 'channel_editor', 'user_read', 'channel_read'],
        api: {
          auth: 'https://id.twitch.tv/oauth2/authorize',
          accessToken: 'https://id.twitch.tv/oauth2/token',
          user: 'https://api.twitch.tv/kraken/channel',
        },
      },
    ],
  },
};
