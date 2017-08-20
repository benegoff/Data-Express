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
  email: String,
  age: Number,
  answers: [
    {
      questionText: String,
      answerText: String
    },
    {
      questionText: String,
      answerText: String
    },
    {
      questionText: String,
      answerText: String
    },
  ],
  role: String
});

var User = mongoose.model('User_Collection', userSchema);

exports.index = function (req, res) {
  User.find(function (err, users) {
    if (err) return console.error(err);
    res.cookie('lastVisited', new Date().toUTCString());
    res.render('index', {
      title: 'User Answers',
      users: users,
      lastVisited: req.cookies.lastVisited
    });
  });
};

exports.login = function (req, res) {
  res.render('login', {
    title: 'Login'
  });
};

exports.upgradeUser = function (req, res) {
  console.log('User ID: ' + req.body.id)
  var user = User.findById(req.body.id, function(err, user){
    if(user){
      console.log('Found User');
      user.role = 'admin';
      user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(req.body.username + ' added');
      });
    }
  });
  res.redirect('admin');
};

exports.loginUser = function (req, res) {
  var user = User.findOne({ name: req.body.username }, function (err, user) {
    if (user) {
      console.log('Found User');
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          console.log('Login successful');
          if(user.role === 'admin'){
            req.session.user = { isAuthenticated: true, username: req.body.username, isAdmin: true };
          }else{
            req.session.user = { isAuthenticated: true, username: req.body.username, isAdmin: false };
          }
          
          res.redirect('account/' + user.id);
        }
        else {
          res.redirect('login');
        }
      });
    } else {
      res.redirect('login');
    }
  });
}

exports.logout = function (req, res) {
  req.session.destroy();
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

exports.admin = function(req, res) {
  User.find(function (err, users) {
    if (err) return console.error(err);
    res.render('admin', {
      title: 'Admin Tools',
      users: users
    });
  });
}

exports.registerUser = function (req, res) {
  User.findOne({ name: req.body.username }, function (err, existingUser) {
    if (!existingUser) {
      bcrypt.hash(req.body.password, null, null, function (err, hash) {
        var user = new User({
          password: hash,
          name: req.body.username,
          email: req.body.email,
          age: req.body.age,
          answers: [
            {
              questionText: "What do you like more?",
              answerText: req.body.Q1
            },
            {
              questionText: "Who is the better cook?",
              answerText: req.body.Q2
            },
            {
              questionText: "Where would you like to live?",
              answerText: req.body.Q3
            }
          ],
          role: 'user'
        });
        user.save(function (err, user) {
          if (err) return console.error(err);
          console.log(req.body.username + ' added');
        });
        req.session.user = { isAuthenticated: true, username: req.body.username };
        res.redirect('/account/' + user.id);
      });
    } else {
      console.log('Name already exists');
      return res.redirect('/register');
    }
  });
};

exports.updateAnswers = function (req, res) {
  User.findById(req.body.id, function (err, user) {
    user.answers = {
      answer1: {
        questionText: "What do you like more?",
        answerText: req.body.Q1
      },
      answer2: {
        questionText: "Who is the better cook?",
        answerText: req.body.Q2
      },
      answer3: {
        questionText: "Where would you like to live?",
        answerText: req.body.Q3
      }
    }
    user.save(function (err, user) {
      if (err) return console.error(err);
      console.log(user.name + ' answers updated');
    });
    res.redirect('/account/' + user.id);
  });
};

exports.updatePassword = function (req, res) {
  User.findById(req.body.id, function (err, user) {
    if (req.body.newPassword === req.body.confirmPassword) {
      bcrypt.compare(req.body.oldPassword, user.password, function (err, result) {
        if (result) {
          bcrypt.hash(req.body.newPassword, null, null, function (error, hash) {
            user.password = hash;
            user.save(function (err, user) {
              if (err) return console.error(err);
              console.log(user.name + ' password updated');
              res.redirect('/account/' + user.id);
            });
          });
        } else {
          res.redirect('/account/' + user.id);
        }
      });
    } else {
      res.redirect('/account/' + user.id);
    }
  });
};

exports.updateInfo = function (req, res) {
  User.findById(req.body.id, function (err, user) {
    user.email = req.body.newEmail;
    user.age = req.body.newAge;
    user.save(function (err, user) {
      if (err) return console.error(err);
      console.log(user.name + ' info updated');
    });
    res.redirect('/account/' + user.id);
  });
};