var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  ;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){}
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/tickets/new');
});

router.get('/login', function (req, res, next) {
  res.render('login')
});

router.post('/login', function (req, res, next) {
  passport.authenticate('google', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true });
});

router.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});