var express = require('express')
  , glob = require('glob')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , compress = require('compression')
  , methodOverride = require('method-override')
  , exphbs  = require('express-handlebars')
  , passport = require('passport')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , flash = require('connect-flash')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  // , User = require('../app/models/user')
  ;

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.engine('handlebars', exphbs({
    layoutsDir: config.root + '/app/views/layouts/',
    defaultLayout: 'main',
    partialsDir: [config.root + '/app/views/partials/']
  }));
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'handlebars');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore(config.redis)
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    try {
      User.db.view(User.dDoc,'by_id', {key: id, include_docs: true}, function(err, body) {
        if (err) {
          console.log(err);
          console.log(err.stack);
        }
        var user = body.rows[0].doc;
        return done(err, user);
      });
    } catch(e) {
      console.error(e.message);
      console.error(e.stack);
      return done(e, null)
    }
  });

  passport.use(new GoogleStrategy({
      clientID: config.googClientId,
      clientSecret: config.googClientSecret,
      callbackURL: config.googCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      profile = profile._json;
      if (ALLOWED_HOSTS.indexOf(profile.domain) >= 0) {
        User.db.view(User.dDoc, 'by_google', {key: profile.id, include_docs: true}, function (err, body) {
          if (err === null && body.rows && body.rows.length === 0) {
            User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.image.url,
              googleId: profile.id
            }, function(err, conf) {
                User.getById(conf.id, function(err, body) {
                if (!err) { done(null, body.id)}
              });
            });
          } else {
            var user = body.rows[0].doc;
            done(err, user);
          }
        });
      } else {
        // fail
        done(new Error("You are not authorized."));
      }
    }
  ));

  app.use(flash());


  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
