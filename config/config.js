var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'checkit'
    },
    port: 3000,
    redis: {
      host: 'localhost',
      port: 6379,
      pass: ''
    },
    googClientId: process.env.GOOGLE_CLIENT_ID,
    googClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googCallbackUrl: 'http://127.0.0.1:3000/auth/google/callback',
    db: 'mongodb://localhost/checkit-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'checkit'
    },
    port: 3000,
    googClientId: process.env.GOOGLE_CLIENT_ID,
    googClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googCallbackUrl: 'http://127.0.0.1:3000/auth/google/callback',
    db: 'mongodb://localhost/checkit-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'checkit'
    },
    port: 3000,
    redis: {
      host: 'localhost',
      port: 6379,
      pass: ''
    },
    googClientId: process.env.GOOGLE_CLIENT_ID,
    googClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googCallbackUrl: 'http://127.0.0.1:3000/auth/google/callback',
    db: 'mongodb://localhost/checkit-production'
  }
};

module.exports = config[env];
