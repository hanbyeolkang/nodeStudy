var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
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

app.get('/', function (req, res) {
  if(!req.session.name)
    res.redirect('/login');
  else
    res.redirect('/welcome');
});
app.get('/login', function(req, res){
  if(!req.session.name)
    res.render('login', {message:'input your id and password.'});
  else
    res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(!req.session.name)
    return res.redirect('/login');
  else
    res.render('welcome', {name:req.session.name});
});
app.get('/logout', function(req, res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
});

app.post('/login', function(req, res) {
  var id = req.body.username;
  var pw = req.body.password;
  var sql = 'SELECT * FROM user WHERE id=?';
  conn.query(sql, [id], function(err, results){
    if(err)
      console.log(err);

    if(!results[0])
      return res.render('login', {message:'please check your id.'});

    var user = results[0];
    crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function(err, derivedKey){
      if(err)
        console.log(err);
      if(derivedKey.toString('hex') === user.password){
        req.session.name = user.name;
        req.session.save(function(){
          return res.redirect('/welcome');
        });
      }
      else {
        return res.render('login', {message:'please check your password.'});
      }
    });//pbkdf2
  });//query
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
