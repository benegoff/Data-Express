var mongoose = require('mongoose');
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
        answer1: Number,
        answer2: Number,
        answer3: Number
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

exports.login = function(req, res){
    res.render('login', {
        title: 'Login'
    });
};

exports.account = function(req, res){
    User.findById(req.params.id, function(err, user){
        res.render('account', {
            title: 'Your Profile',
            user: user
        });
    });
};