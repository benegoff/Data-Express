var express = require('express');
var expressSession = require('express-sessions');
var pug = require('pug');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('mongodb-bluebird');
var path = require('path');

var app = express();
app.listen(3000);