var express = require('express');
var expressSession = require('express-sessions');
var pug = require('pug');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var route = require('./routes/routes.js')

var app = express();

var checkAuth = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
})

app.get('/', route.index);
app.get('/register', route.register);
app.post('/register', route.registerUser);
app.get('/login', route.login);
app.get('/account/:id', checkAuth, route.account);

app.listen(3000);