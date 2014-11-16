//npm link gulp path express cookie-parser express-session body-parser method-override morgan bcryptjs mongoose passport passport-local async request xml2js agenda sugar nodemailer lodash passport-facebook passport-google browser-sync nanotimer
//construct alias for
//ssh root@beaglenode2 "reboot" && ssh root@beaglenode1 "reboot" && ssh root@beagleserver "reboot"
//ssh root@beaglenode2 "poweroff" && ssh root@beaglenode1 "poweroff" && ssh root@beagleserver "poweroff"







var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

//var agenda = require('agenda')({ db: { address: 'beagleserver:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var _ = require('lodash');

//Login
var config = require('./public/oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var os = require('os');

//Lcd







var quizStates = function(){
  return {
    quizId: undefined,
    questionId: undefined,
    time : undefined,
    timer : "paused"
  }
}

// Schema(s) for Mongoose

var answerSchema = mongoose.Schema({
  timestamp: Number,
  quizId: String, //refer to Quiz
  questionId: Number, //refer to Question
  memberName: String,
  teamNumber: Number,
  answerNumber: Number
});

var Answer = mongoose.model('Answer', answerSchema);


// team
var teamSchema = mongoose.Schema({
  _id: String, //name
  memberNames: [String],
  teamNumber: Number
});

var Team = mongoose.model('Team', teamSchema);

// Questions

var questionSchema = new mongoose.Schema({
  _id: Number, //questionNumber
  imageUrl: String,
  content: String,
  possibleAnswers: [String],
  correctAnswer: Number,
  score: Number,
  timeAllowed: Number
});

var Question = mongoose.model('Question', questionSchema);

// User

var userSchema = new mongoose.Schema({
  oauthID: Number,
  name: String,
  link: String,
  picture: String,
  pictureArray: String,
  created: Date,
  email: { type: String, unique: true },
  emailArray: { type: String, value: String },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

// Quiz

var quizSchema = new mongoose.Schema({
  _id: String, //_id is the name of the quiz!
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  questions: [{
    _id: Number, //questionNumber
    imageUrl: String,
    content: String,
    possibleAnswers: [String],
    correctAnswer: Number,
    score: Number,
    timeAllowed: Number
  }],
  teams: [{
    _id: String, //name
    memberNames: [String],
    teamNumber: Number
  }],
  currentQn: Number,
  teamAnswers: [{
    timestamp: Number,
    quizId: String, //refer to Quiz
    questionId: Number, //refer to Question
    memberName: String,
    teamNumber: Number,
    answerNumber: Number
  }],
  teamScores: [Number],
  status: String, //'Not Played', 'Playing', 'Paused' , 'Ended'
  description: String
});

var Quiz = mongoose.model('Quiz', quizSchema);

/*
var quizSchema = new mongoose.Schema({
  _id: String, //_id is the name of the quiz!
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Question'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Team'
  }],
  currentQn: Number,
  teamAnswers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Answer'
  }],
  teamScores: [Number],
  status: String, //'Not Played', 'Playing', 'Paused' , 'Ended'
  description: String
});
*/


/*

To implement backup DBs in the future for redundancy
Look at Mongoose#connect

*/

var mongoUri = 'mongodb://beagleserver/test,mongodb://localhost/test'

mongoose.connect(mongoUri, function(err){
  if (err) {
    console.log("Cannot connect to beagleserver!")
    console.log(err);
  }
});







// USER Init

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log(user);
    if(!err) done(null, user);
    else done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' },
function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

// Get more info here
//http://stackoverflow.com/questions/20291357/passport-facebook-cant-get-about-me-and-email-profile-fields

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'first_name', 'last_name', 'link', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
  User.findOne({ oauthID: profile.id }, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new User({
        oauthID: profile.id,
        name: profile.displayName,
        link: profile.link,
        picture: profile.photos[0].value,
        email: profile.emails[0].value,
        created: Date.now()
      });
      user.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
  });
}
));

passport.use(new GoogleStrategy({
   returnURL: config.google.returnURL,
   realm: config.google.realm
 },
 function(accessToken, refreshToken, profile, done) {
 User.findOne({ oauthID: profile.id }, function(err, user) {
   if(err) { console.log(err); }
   if (!err && user != null) {
     done(null, user);
   } else {
     var user = new User({
       oauthID: profile.id,
       name: profile.displayName,
       created: Date.now()
     });
     user.save(function(err) {
       if(err) {
         console.log(err);
       } else {
         console.log("saving user ...");
         done(null, user);
       };
     });
   };
 });
}
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}





//Allow Cross Domain Requests
//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
//http://enable-cors.org/
//http://www.html5rocks.com/en/tutorials/cors/

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


// ---------------------------------------
// Web App init
// ---------------------------------------

var app = express();
var ioServer = require('http').Server(app)




// Socket IO Magic


// Client Server interactions
/*
  Update QuizDB client -> server -> cilent (client must listen to this)
  Timer event init
  Timer event pause -> persistentReadToDB stop
  Quiz

  Server init instuction
  Question ended -> emit ended instruction to all clients
*/

var ioSocketServerClient = require('socket.io')(ioServer);
ioServer.listen(3001, function(){
  console.log("ioServer running at port 3001!")
});

ioSocketServerClient.on('connection', function (socket) {

  //Tell both client and server that they connected
  console.log("Socket intialized");
  socket.emit('connected', { hostname: os.hostname() });
  socket.on('helloRecieved', function(data){
    console.log("Connected to " + data.hostname);
  });
  //ioSocketServerClient.emit('connected', { hello: 'you are connected to ' + os.hostname() });

  socket.on('print status', function(status){
    console.log("Message from " + status.hostname);
    console.log(status.message);
    socket.broadcast.emit('print status', status);
  });

  /*

  TO DO: MOVE AUTHORIZATION FUNCTIONS INTO THIS SERVER SCRIPT
  RELYING ON ANGULARJS WILL PROVE DETRIMENTAL TO SECURITY OF QUIZ

  */

  //Timer functions
  socket.on('initTimer', function (quizState) {
    socket.broadcast.emit('timerInit', {
      quizId : quizState.quizId,
      questionId: quizState.questionId,
      time : quizState.time,
      authorId : quizState.authorId
    });
    console.log("Timer Initialized/Restarted at " + quizState.time + " seconds.");
  });

  socket.on('pauseTimer', function (quizState) {
    socket.broadcast.emit('timerPaused', {
      quizId : quizState.quizId,
      questionId: quizState.questionId,
      time : quizState.time,
      authorId : quizState.authorId
    });
    console.log("Timer Paused at " + quizState.time + " seconds.");
  });

  socket.on('startTimer', function (quizState) {
    socket.broadcast.emit('timerStarted', {
      quizId: quizState.quizId,
      questionId: quizState.questionId,
      time : quizState.time,
      authorId : quizState.authorId
    });
    console.log("Timer Started by " + quizState.authorId);
  });

  //Quiz (Overall) functions
  socket.on('updateQuiz', function (quizUpdate) {
    //console.log(quizUpdate);
    // TO DO:
    //This is data sanitizing. Not good as it is dependent on angular implementation. Change this
    var dbQuizUpdate = {}
    for(var propertyName in quizUpdate) {
      if (propertyName != '__v' && propertyName != '$resolved' && propertyName != '$promise'){
        dbQuizUpdate[propertyName] = quizUpdate[propertyName];
      }
    }
    //console.log(dbQuizUpdate);
    Quiz.update({ _id: quizUpdate._id }, dbQuizUpdate, function(err, numberAffected, raw) {
      if (err) return console.log(err);
      //console.log('Number of affected documents was %d', numberAffected);
      //console.log('Raw response from MongoDB: ', raw);
    });
    socket.broadcast.emit('updateQuiz', quizUpdate);
    console.log("Quiz Updated");
  });
  socket.on('initQuizState', function (quizState) {
    socket.broadcast.emit('initQuizState', {
      quizID : quizState.quizId,
      time : quizState.timeleft,
      timer : "paused",
      machineId: quizState.machineId,
      authorId : quizState.authorId
    });
    console.log("Quiz State written to " + quizState.machineId);
  });

  //DB functions
  socket.on('readCard', function (quizState) {
    // receive from client to get nodes to read card
    socket.broadcast.emit('readCard', {
      quizId : quizState.quizId,
      quesitonId : quizState.questionId,
      machineId : quizState.machineId,
      authorId : quizState.authorId
    });
    console.log("Card Read Requested at " + quizState.machineId );
  });
  socket.on('setCard', function (cardData) {
    // Card Data coming from Node
    /*
    Test Case
    ioSocketClientServer.emit('setCard', { quizId : 'blah3', questionId : 2, memberName : "noob", teamNumber : 1, answerNumber : 2});

    */
    // STEP 1: store to DB
    console.log(cardData);
    if (cardData == null || cardData == undefined) {return}
    var newAnswer = new Answer({
      timestamp : new Date().getTime(),
      quizId : cardData.quizId,
      questionId : cardData.questionId,
      memberName : cardData.memberName,
      teamNumber : cardData.teamNumber,
      answerNumber : cardData.answerNumber
    })
    newAnswer.save(function(err){
      if (err) return next(err);
    })
    socket.broadcast.emit('answerRead', {
      // STEP 2: To display which team answered, and how long it took them to answer
      //For Client
      quizId : cardData.quizId,
      questionId : cardData.questionId,
      teamNumber: cardData.teamNumber,
      name : cardData.memberName
    });
    console.log("read card to DB");
  });
  socket.on('readFromDB', function (quizState) {
    var answerMatrix = [];
    for (var teamNo = 0; teamNo < quizState.noOfTeams; teamNo++){
      Answer.find({
        quizId : quizState.quizId,
        questionId : quizState.questionId,
        teamNumber : teamNo
      }).sort({timestamp:-1}).limit(1).exec(function (err, answer){
        answerMatrix.push(answer);
      });
    }
    socket.broadcast.emit('dataFromDB', answerMatrix);
    console.log("Answers sent");
  });

  //Card Reader Functions
  socket.on('writeCard', function (cardData) {
    socket.broadcast.emit('writeCard', {
      memberName : cardData.memberName,
      team : cardData.team,
      answer : cardData.answer,
      machineId : cardData.machineId
    });
    console.log("Card write request sent");
  });



  //Other functions
  socket.on('backupCallback', function (callback) {
    console.log(callback);
    callback();
  });


  //Signal closure of socket
  socket.on('disconnect', function(){
    console.log("Socket closed");
  });
});




// --------------------------------------------
// Rest of Express config
// --------------------------------------------


app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

app.get('/api/logout', function(req, res) {
  req.logout();
  res.send(200);
});

app.post('/api/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});


// AUTHENTICATION


app.get('/account', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.send(req.user);
    }
  })
})
app.get('/api/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
  });
app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    //res.send('<script type="text/javascript">self.close()</script>');
    res.redirect('/account');
  });
app.get('/api/auth/google',
  passport.authenticate('google'),
  function(req, res){
  });
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });


// AUTH








app.get('/api/quizzes', function(req, res, next) {
  var query = Quiz.find();
  //Fix this later
  if (req.query.author) {
    query.where({ author: req.query.author });
  }else if (req.query.status) {
    query.where({ author: req.query.status });
  }else {
    query.limit(12);
  }
  query.exec(function(err, quizzes) {
    if (err) return next(err);
    res.send(quizzes);
  });
});

app.get('/api/quizzes/:id', function(req, res, next) {
  Quiz.findById(req.params.id, function(err, quiz) {
    if (err) return next(err);
    res.send(quiz);
  });
});



app.post('/api/quizzes', function (req, res, next) {

  //Format 1: quiz recieved. Handle update of quiz
  var quizUpdate = req.body.quiz
  if (quizUpdate != undefined){
    Quiz.update({ _id: quizUpdate._id }, quizUpdate, function(err, numberAffected, raw) {
      if (err) return handleError(err);
      console.log('Number of affected documents was %d', numberAffected);
      console.log('Raw response from MongoDB: ', raw);
      res.send(200);
    });
    return;
  }

  //Format 2: New quiz to be created
  var quizName = req.body.quizName.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
  var quizDescription = req.body.quizDescription;
  var quizAuthor = req.body.quizAuthor;
  var quiz = new Quiz({
    _id: quizName,
    author: quizAuthor,
    questions: [],
    currentQn: 0,
    teamAnswers: [],
    teamScores: [],
    teams: [],
    status: 'Not Played',
    description: quizDescription
  });
  quiz.save(function (err) {
    if (err) {
      if (err.code == 11000) {
        return res.send(409, { message: quiz._id + ' already exists.' });
      }
      return next(err);
    }
    res.send(200);
  });
});


app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});











app.post('/api/play', ensureAuthenticated, function(req, res, next) {
  Quiz.findById(req.body.quizName, function(err, quiz) {
    if (err) return next(err);
    if (quiz.currentQuestion != 0 && quiz.currentQuestion != -1){
      res.send(409, { message: "Quiz is still ongoing!"})
    }
    if (quiz.status == 'Not Played' || quiz.status == 'Ended'){ quiz.currentQuestion = 1; };
    if (quiz.status == 'Playing'){
      quiz.save(function(err) {
        if (err) return next(err);
        res.send(200);
        return;
        });
      }
    quiz.status = 'Playing';
    quiz.teamAnswers = [];
    quiz.teamScores = [];
    quiz.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

app.post('/api/stopPlaying', ensureAuthenticated, function(req, res, next) {
  Quiz.findById(req.body.quizName, function(err, quiz) {
    if (err) return next(err);
    if (quiz.status == 'Ended'){ res.send(200); return; }
    quiz.status = 'Ended';
    quiz.currentQuestion = -1;
    quiz.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

app.post('/api/pausePlaying', ensureAuthenticated, function(req, res, next) {
  Quiz.findById(req.body.quizName, function(err, quiz) {
    if (err) return next(err);
    if (quiz.status == 'Paused'){
      quiz.status = 'Playing';
    }else if (quiz.status == 'Playing'){
      quiz.status = 'Paused';
    }
    quiz.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});













// ---------------------------

/*
app.get('/api/shows', function(req, res, next) {
  var query = Show.find();
  if (req.query.genre) {
    query.where({ genre: req.query.genre });
  } else if (req.query.alphabet) {
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
  } else {
    query.limit(12);
  }
  query.exec(function(err, shows) {
    if (err) return next(err);
    res.send(shows);
  });
});

app.get('/api/shows/:id', function(req, res, next) {
  Show.findById(req.params.id, function(err, show) {
    if (err) return next(err);
    res.send(show);
  });
});

app.post('/api/subscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    show.subscribers.push(req.user.id);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

app.post('/api/unsubscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    var index = show.subscribers.indexOf(req.user.id);
    show.subscribers.splice(index, 1);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

*/














/*

app.post('/api/shows', function (req, res, next) {
  var apiKey = '9EF1D1E7D28FDA0B';
  var parser = xml2js.Parser({
    explicitArray: false,
    normalizeTags: true
  });
  var seriesName = req.body.showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

  async.waterfall([
    function (callback) {
      request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function (err, result) {
          if (!result.data.series) {
            return res.send(404, { message: req.body.showName + ' was not found.' });
          }
          var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
          callback(err, seriesId);
        });
      });
    },
    function (seriesId, callback) {
      request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function (error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function (err, result) {
          var series = result.data.series;
          var episodes = result.data.episode;
          var show = new Show({
            _id: series.id,
            name: series.seriesname,
            airsDayOfWeek: series.airs_dayofweek,
            airsTime: series.airs_time,
            firstAired: series.firstaired,
            genre: series.genre.split('|').filter(Boolean),
            network: series.network,
            overview: series.overview,
            rating: series.rating,
            ratingCount: series.ratingcount,
            runtime: series.runtime,
            status: series.status,
            poster: series.poster,
            episodes: []
          });
          _.each(episodes, function (episode) {
            show.episodes.push({
              season: episode.seasonnumber,
              episodeNumber: episode.episodenumber,
              episodeName: episode.episodename,
              firstAired: episode.firstaired,
              overview: episode.overview
            });
          });
          callback(err, show);
        });
      });
    },
    function (show, callback) {
      var url = 'http://thetvdb.com/banners/' + show.poster;
      request({ url: url, encoding: null }, function (error, response, body) {
        show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, show);
      });
    }
  ], function (err, show) {
    if (err) return next(err);
    show.save(function (err) {
      if (err) {
        if (err.code == 11000) {
          return res.send(409, { message: show.name + ' already exists.' });
        }
        return next(err);
      }
      var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
      agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');
      res.send(200);
    });
  });
});

*/



/*

agenda.define('send email alert', function(job, done) {
  Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
    var emails = show.subscribers.map(function(user) {
      return user.email;
    });

    var upcomingEpisode = show.episodes.filter(function(episode) {
      return new Date(episode.firstAired) > new Date();
    })[0];

    var smtpTransport = nodemailer.createTransport('SMTP', {
      service: 'SendGrid',
      auth: { user: 'hslogin', pass: 'hspassword00' }
    });

    var mailOptions = {
      from: 'Fred Foo ✔ <foo@blurdybloop.com>',
      to: emails.join(','),
      subject: show.name + ' is starting soon!',
      text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
        'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      console.log('Message sent: ' + response.message);
      smtpTransport.close();
      done();
    });
  });
});

agenda.start();

agenda.on('start', function(job) {
  console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
  console.log("Job %s finished", job.attrs.name);
});

*/
