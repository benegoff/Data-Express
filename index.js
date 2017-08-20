var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var pug = require('pug');
var bodyParser = require('body-parser');
var path = require('path');
var route = require('./routes/routes.js')

var app = express();
app.use(cookieParser('SuperSecretPassphrase'));

var checkAuth = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

var checkAdmin = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated && req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(expressSession({secret: 'SupahSekret', saveUninitialized: true, resave: true, cookie:{maxAge:86400000}}));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
})

app.get('/', route.index);
app.get('/register', route.register);
app.post('/register', urlencodedParser, route.registerUser);
app.get('/login', route.login);
app.post('/login', urlencodedParser, route.loginUser);
app.get('/account/:id', checkAuth, route.account);
app.post('/editAnswers', urlencodedParser, route.updateAnswers);
app.post('/editPassword', urlencodedParser, route.updatePassword);
app.post('/editInfo', urlencodedParser, route.updateInfo);
app.get('/logout', checkAuth, route.logout);
app.get('/admin', checkAdmin, route.admin);
app.post('/upgradeUser', urlencodedParser, route.upgradeUser);

app.listen(3000);