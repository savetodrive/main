const { APP_HOST } = process.env;

const { env } = process;
const config = {
  app: {
    "frontend-port": "3001",
    port: process.env.APP_PORT || 3000,
    name: 'Save To Drive',
    domain: process.env.APP_HOST || 'localhost',
  },
  database: {
    mongo: {
      host: env.MONGO_HOST,
      user: env.MONGO_USER,
      password: env.MONGO_PASSWORD,
    },
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    },
  },
  email: {
    from: env.MAIL_FROM,
    host: env.MAIL_HOST, // smtp.gmail.com
    port: env.MAIL_PORT || undefined,
  },
  auth: {
    jwt: {
      secret: env.JWT_SECRET,
      session: {
        session: false,
        expiresIn: 1,
      },
    },
    strategy: {
      facebook: {
        clientID: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${APP_HOST}/service/redirect/facebook`,
        profileFields: ['id', 'emails', 'name'],
      },
      google: {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${APP_HOST}/service/redirect/google`,
      },
    },
  },
};

if (env.NODE_ENV === 'production') {
  config.email.user = env.MAIL_USER_NAME;
  config.email.password = env.MAIL_PASSWORD;
}
module.exports = config;
