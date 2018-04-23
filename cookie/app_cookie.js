const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser('!@#$%^&*'));

app.get('/cookie', function(req, res){
  var myCookie = 1;
  if(req.signedCookies.myCookie) {
    myCookie = parseInt(req.signedCookies.myCookie)+1;
  }
  res.cookie('myCookie', myCookie, {signed:true});
  res.send('myCookie: ' + myCookie);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
