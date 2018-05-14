var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var ejs = require('ejs');
var crypto = require('crypto');
var dbConfig = require('./dbConfig');

var app = express();
var dbOptions = dbConfig;
var conn = mysql.createConnection(dbOptions);
conn.connect();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '!@#$%^&*',
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    var sql = 'SELECT * FROM user WHERE id=?';
    conn.query(sql, [username], function(err, results){
      if(err)
        return done(err);
      if(!results[0])
        return done('please check your id.');

      var user = results[0];
      crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', function(err, derivedKey){
        if(err)
          return done(err);

        if(derivedKey.toString('hex') === user.password)
          return done(null, user);
        else
          return done('please check your password.');
      });//pbkdf2
    });//query
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 passport.deserializeUser(function(id, done) {
  var sql = 'SELECT * FROM user WHERE id=?';
  conn.query(sql, [id], function(err, results){
    if(err)
      return done(err, false);
    if(!results[0])
      return done(err, false);

    return done(null, results[0]);
  });
});

app.get('/', function (req, res) {
  if(!req.user)
    res.redirect('/login');
  else
    res.redirect('/welcome');
});
app.get('/login', function(req, res){
  if(!req.user)
    res.render('login', {message:'input your id and password.'});
  else
    res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(!req.user)
    return res.redirect('/login');
  else
    res.render('welcome', {name:req.user.name});
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/login',
      failureFlash: false
    })
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
