var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var userSchema = mongoose.Schema({
  name: String,
  password: String,
  answers: {
    answer1: String,
    answer2: String,
    answer3: String
  }
});

var User = mongoose.model('User_Collection', userSchema);

exports.index = function (req, res) {
  User.find(function (err, user) {
    if (err) return console.error(err);
    res.render('index', {
      title: 'User Answers',
      answers: user.answers
    });
  });
};

exports.login = function (req, res) {
  res.render('login', {
    title: 'Login'
  });
};

exports.loginUser = function(req, res){
  var user = User.findOne({name: req.body.username}, function(err, user){
    if(user){
      console.log('Found User');
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
          console.log('Login successful');
          req.session.user = { isAuthenticated: true, username: req.body.username};      
          res.redirect('account/' + user.id);
        }
        else{
          res.redirect('login');
        }
      }); 
    }else{
      res.redirect('login');
    }
  });
}

exports.logout = function(req, res){
  req.session.destory();
  res.redirect('/');
}

exports.account = function (req, res) {
  console.log('USER ID: ' + req.params.id);
  User.findById(req.params.id, function (err, user) {
    res.render('account', {
      user: user
    });
  });

};

exports.register = function (req, res) {
  res.render('register', {
    title: 'Register'
  });
};

exports.registerUser = function (req, res) {
  User.findOne({name: req.body.username}, function(err, existingUser){
    if(!existingUser){
      bcrypt.hash(req.body.password, null, null, function(err, hash){
        var user = new User({
          password: hash,
          name: req.body.username,
          answers: {
            answer1: req.body.Q1,
            answer2: req.body.Q2,
            answer3: req.body.Q3
          }
        });
        user.save(function (err, user) {
          if (err) return console.error(err);
          console.log(req.body.username + ' added');
        });
        req.session.user = { isAuthenticated: true, username: req.body.username};
        res.redirect('/account/' + user.id);
      });
    }else{
      console.log('Name already exists');
      return res.redirect('/register');
    }
  });
};

exports.updateAnswers = function(req, res){
  User.findById(req.body.id, function(err, user) {
    user.answers.answer1 = req.body.Q1;
    user.answers.answer2 = req.body.Q2;
    user.answers.answer3 = req.body.Q3;
    user.save(function(err, user){
      if (err) return console.error(err);
      console.log(user.name + ' answers updated');
    });
  });
  req.session.user = {
    isAuthenticated: true,
    username: req.body.username
  };
  res.redirect('/account/' + user.id);
};

exports.updatePassword = function(req, res){
  User.findById(req.body.id, function(err, user) {
    if(req.params.newPassword === req.params.confirmPassword){
      bcrypt.compare(req.params.oldPassword, user.password, function(err, res){
        bcrypt.hash(req.params.newPassword, null, null, function(errr, hash){
          user.save(function(err, user){
            if (err) return console.error(err);
            console.log(user.name + ' password updated');
          });
        });
      });
    }
  });
  res.redirect('/account/' + user.id);
};