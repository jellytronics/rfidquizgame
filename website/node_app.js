/*
Init system for NFC reading <- try to find a more permenant solution
This is a workaround
*/

var os = require('os')

if(os.hostname() != 'jellymac'){
  var child_process = require('child_process');
  child_process.exec("ls /sys/devices/bone_capemgr*/slots", function (error, stdout, stderr){
    if (error) {console.log("Error: " + error); return};
    var destination = stdout.replace(/\n$/, '');
    child_process.exec("echo BB-UART1 > " + destination, function(error, stdout, stderr){
      if (error) {console.log("Error: " + error);};
      console.log(stdout);
      console.log(stderr);
    })
  });
}


// Mifare Init
var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes
var events = require("events");
var EventEmitter = require("events").EventEmitter;


var io = require('socket.io-client');
var ioSocketClientServer = io.connect('http://192.168.2.231:3001'); // change to beagleserver
ioSocketClientServer.on('connected', function(data){
  console.log('Connected to ' + data.hostname);
  ioSocketClientServer.emit('helloRecieved', {hostname : os.hostname() });
});







var nodeQuizState = {
  quizId: undefined,
  questionId: undefined,
  time : undefined,
  timer : "paused",
  machineId : os.hostname(),
  authorId : undefined,
  defaultTimeInterval : 500,
  defaultTerminateTime : 30,
  maxTerminateTime : 300,
  minTerminateTime : 1
}


// MIFARE Init and Basic Functions

var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes

/*

function readMifare(){
  var messageRead;
  mifare.read(function(err, buffer) {
    if (err){return}
    var messageRead = ndef.decodeMessage(buffer.toJSON())
    console.log(ndef.stringify(messageRead));
  })
  return messageRead;
}


function formatMifare(){
  mifare.format(function(err) {
    if (err) {
      return
    }
    console.log("card formatted")
  })
}

function readCard(answerInstance){
  if (answerInstance == undefined) { var answerInstance = {} };
  var messageRead;
  mifare.read(function(err, buffer) {
    if (err){return}
    var messageRead = ndef.decodeMessage(buffer.toJSON())
    if (messageRead == undefined || messageRead[0] == undefined) {
      delete answerInstance.timestamp;
      delete answerInstance.name;
      delete answerInstance.teamNumber;
      delete answerInstance.answerNumber;
      return}
    answerInstance.timestamp = new Date().getTime();
    answerInstance.name = ndef.text.decodePayload(messageRead[0].payload);
    answerInstance.teamNumber = ndef.text.decodePayload(messageRead[1].payload);
    answerInstance.answerNumber = ndef.text.decodePayload(messageRead[2].payload);
    console.log(answerInstance);
  });
}

*/

function writeMifare(message){
  bytes = ndef.encodeMessage(message);
  mifare.write(bytes, function(err) {
    if (err) {
      return
    }
    console.log("data written")
  })
}

function readCard(){
  var messageRead;
  mifare.read(function(err, buffer) {
    if (err){return}
    var messageRead = ndef.decodeMessage(buffer.toJSON())
    if (messageRead == undefined || messageRead[0] == undefined) {return undefined}
    var cardData = {
      quizId : nodeQuizState.quizId,
      questionId : nodeQuizState.questionId,
      memberName : ndef.text.decodePayload(messageRead[0].payload),
      teamNumber : ndef.text.decodePayload(messageRead[1].payload),
      answerNumber : ndef.text.decodePayload(messageRead[2].payload)
    };
    console.log(cardData);
    return cardData;
  });
}

function writeCard(memberName, teamNumber, answerNumber){
  message = [
    ndef.textRecord(memberName),
    ndef.textRecord(teamNumber.toString()),
    ndef.textRecord(answerNumber.toString())
  ]
  writeMifare(message);
}


// Card and Quiz functions



var persistentReadfunction;
var persistentReadfunctiontimer;

var persistentReadEvent = new EventEmitter();

persistentReadEvent.on("state on", function (timeInterval) {
  if (nodeQuizState.timer == "start") {clearInterval(persistentReadfunction);};
  if ( typeof timeInterval == 'undefined' || isNaN(parseInt(timeInterval))) { timeInterval = nodeQuizState.defaultTimeInterval; } else { timeInterval = parseInt(timeInterval); }
  persistentReadfunction = setInterval(function(err){
    ioSocketClientServer.emit('setCardToDB', readCard());
    ioSocketClientServer.emit('helloRecieved', {hostname : os.hostname() });
    }, timeInterval);
  console.log("persistentReadToDB activated");
});

persistentReadEvent.on("state off", function () {
  clearInterval(persistentReadfunction);
  console.log("persistentReadToDB deactivated");
});

persistentReadEvent.on("state timed", function (timeInterval, terminateTime) {
  // To Prevent Errors, remove last readfunction
  clearInterval(persistentReadfunction);
  if ( typeof terminateTime == 'undefined' || isNaN(parseInt(terminateTime)) || terminateTime > nodeQuizState.maxTerminateTime || terminateTime < nodeQuizState.minTerminateTime) { terminateTime = nodeQuizState.defaultTerminateTime; } else { terminateTime = parseInt(terminateTime); }
  if ( typeof timeInterval == 'undefined' || isNaN(parseInt(timeInterval))) { timeInterval = nodeQuizState.defaultTimeInterval; } else { timeInterval = parseInt(timeInterval); }
  persistentReadfunction = setInterval(function(err){
    ioSocketClientServer.emit('setCardToDB', readCard());
    }, timeInterval);
  console.log("persistentReadToDB activated for " + terminateTime + " seconds.");
  setTimeout(function(){
    clearInterval(persistentReadfunction);
    console.log("persistentReadToDB deactivated");
  }, terminateTime*1000)
});


/*

Nodes can only serve one Quiz at a time for now
Will upgrade nodes to serve many quizzes at a time

*/


ioSocketClientServer.on('connected', function(data){
  console.log('Connected to ' + data.hostname);
  ioSocketClientServer.emit('helloRecieved', {hostname : os.hostname() });
});

ioSocketClientServer.on('initQuizState', function(quizState){
  console.log(quizState);
  //if (quizState.machineId == nodeQuizState.machineId) {
    nodeQuizState.quizId = quizState.quizId;
    nodeQuizState.time = quizState.time;
    nodeQuizState.timer = quizState.timer;
    nodeQuizState.authorId = quizState.authorId;
  //}
});


ioSocketClientServer.on('timerInit', function(quizState){
  console.log('timerInit');
  console.log(quizState);
  //Temp soln for init quiz state not implemented
  nodeQuizState.quizId = quizState.quizId ;
  nodeQuizState.authorId = quizState.authorId;

  if (quizState.quizId == nodeQuizState.quizId && nodeQuizState.authorId == quizState.authorId){
    nodeQuizState.questionId = quizState.questionId;
    nodeQuizState.time = quizState.time;
    nodeQuizState.timer = "paused";
  }
});

ioSocketClientServer.on('timerPaused', function(quizState){
  console.log('timerPaused');
  console.log(quizState);
  if (quizState.quizId == nodeQuizState.quizId && nodeQuizState.questionId == quizState.questionId && nodeQuizState.authorId == quizState.authorId){
    nodeQuizState.time = quizState.time;
    nodeQuizState.timer = "paused";
    //STOP TIMER
    persistentReadEventOld.emit("state off");
  }
});

ioSocketClientServer.on('timerStarted', function(quizState){
  console.log('timerStarted');
  console.log(quizState);
  if (quizState.quizId == nodeQuizState.quizId && nodeQuizState.questionId == quizState.questionId && nodeQuizState.authorId == quizState.authorId){
    nodeQuizState.time = quizState.time;
    nodeQuizState.timer = "start";
    //Start TIMER
    persistentReadEventOld.emit("state timed", null, nodeQuizState.time);
  }
});

ioSocketClientServer.on('readCard', function(quizState){
  console.log(quizState);
  if (quizState.machineId == nodeQuizState.machineId){
    //Read Card
    ioSocketClientServer.emit('setCard', readCard());
  }
});

ioSocketClientServer.on('writeCard', function(cardData){
  console.log(quizState);
  if (quizState.machineId == nodeQuizState.machineId){
    //Read Card
    writeCard(cardData.memberName, cardData.teamNumber, cardData.answerNumber)
  }
});

/*
ioSocketClientServer.on('readCardToDB', function(quizState){
  console.log(quizState);
  if (quizState.machineId == nodeQuizState.machineId){
    //Read Card
    //Start TIMER
    ioSocketClientServer.emit('setCardToDB', readCard());
  }
});
*/


























/*

--------------------------------------------------------------

Everything from here onwards are for backwards compatiblity
Porting Everything over to Socket.IO
Removing express middleware, REST protocols and mongoDB instance

--------------------------------------------------------------

*/

// MIFARE STUFF (LEGACY FUNCTIONS)





//Server part
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

// Mongoose Setup

mongoose.connect('mongodb://beagleserver/test');
//mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Success in opening Db");
});

// Schema for Mongoose

var answerSchema = mongoose.Schema({
  timestamp: Number,
  name: String,
  teamNumber: Number,
  answerNumber: Number
});

var MessageDB = mongoose.model('MessageToDB', answerSchema);

// Close DB with this
//mongoose.connection.close()






// Read till theres no tmr

function readToDB(callback){
  mifare.read(function(err, buffer) {
    if (err){ callback(undefined); return}
    var messageRead = ndef.decodeMessage(buffer.toJSON())
    if (messageRead == undefined || messageRead[0] == undefined) { callback(undefined); return; };
    var answerInstance = {}
    answerInstance.timestamp = new Date().getTime();
    answerInstance.name = ndef.text.decodePayload(messageRead[0].payload);
    answerInstance.teamNumber = ndef.text.decodePayload(messageRead[1].payload);
    answerInstance.answerNumber = ndef.text.decodePayload(messageRead[2].payload);
    var messageDB = new MessageDB(answerInstance);
    messageDB.save(function (err){if (err) {return console.error(err)}});
    if (callback == undefined || typeof callback != 'function') { return messageDB; };
    callback(messageDB);
    return messageDB;
  });
}


function readFromDB(filterCallback, valueCallback){
  //MESSY!
  var queryObj;
  if (typeof valueCallback != "function") { valueCallback = function(){ return;} }
  if (typeof filterCallback == "undefined" || filterCallback == null){
    queryObj = MessageDB.find(function (err, messageDB){
      if (err) return console.error(err);
        console.log(messageDB);
        valueCallback(messageDB);
    })
    return;
  }
  queryObj = MessageDB.find(filterCallback)
  valueCallback(queryObj);
}



// Events Tutorial
// http://code.tutsplus.com/tutorials/using-nodes-event-module--net-35941

// Try to make these non hardcoded
var defaultTimeInterval = 500;
var defaultTerminateTime = 30;
var maxTerminateTime = 120;
var minTerminateTime = 1;

var persistentReadfunctiontimer;

var persistentReadEventOld = new EventEmitter();

persistentReadEventOld.on("state on", function (timeInterval) {
  if ( typeof timeInterval == 'undefined' || isNaN(parseInt(timeInterval))) { timeInterval = defaultTimeInterval; } else { timeInterval = parseInt(timeInterval); }
  persistentReadfunction = setInterval(function(err){ console.log("Time: "+new Date().getTime()); readToDB() }, timeInterval);
  console.log("persistentReadToDB activated");
});

persistentReadEventOld.on("state off", function () {
  clearInterval(persistentReadfunction);
  console.log("persistentReadToDB deactivated");
});

persistentReadEventOld.on("state timed", function (timeInterval, terminateTime) {
  clearInterval(persistentReadfunction);
  console.log("persistentReadToDB reset");
  if ( typeof terminateTime == 'undefined' || isNaN(parseInt(terminateTime))) { terminateTime = defaultTerminateTime; } else { terminateTime = parseInt(terminateTime); }
  if ( typeof timeInterval == 'undefined' || isNaN(parseInt(timeInterval))) { timeInterval = defaultTimeInterval; } else { timeInterval = parseInt(timeInterval); }
  if ( terminateTime > maxTerminateTime ) { terminateTime = maxTerminateTime; }
  if ( terminateTime < minTerminateTime ) { terminateTime = minTerminateTime; }
  persistentReadfunction = setInterval(function(err){ console.log("Time: "+new Date().getTime()); readToDB() }, timeInterval);
  console.log("persistentReadToDB activated for " + terminateTime + " seconds.");
  setTimeout(function(){
    clearInterval(persistentReadfunction);
    console.log("persistentReadToDB deactivated");
  }, terminateTime*1000)
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();

// all environments
app.use(allowCrossDomain);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.send('App up and running!');
});

// In case of trouble, push this to end
app.listen(3000)

app.get('/readDB', function(req, res){
  // dump entire DB into html
  readFromDB(null, function(dbObject){
    res.send(dbObject);
  });
});

// CILENT Side

if (os.hostname() != "beagleserver"){

  app.get('/readCard', function(req, res){
    console.log("Reading Card");
    readToDB(function(card){
      res.send(card);
      console.log(card);
    })
  });

  app.get("/writeCard/:playerName/:teamNumber/:answerNumber", function (request, response) {
    var playerName = request.params.playerName;
    var teamNumber = request.params.teamNumber;
    var answerNumber = request.params.answerNumber;
    console.log( "playerName: " + playerName + " , teamNumber: " + teamNumber + " , answerNumber: " + answerNumber );
    writeCard(playerName, teamNumber, answerNumber)
    response.send( "<p>Card Written with details</p>" + "<p>playerName: " + playerName + " , teamNumber: " + teamNumber + " , answerNumber: " + answerNumber + "</p>");
  });

  var webState = false;

  app.get('/persistentReadToDB', function(req, res){
    // dump entire DB into html
    webState = !webState;
    res.send("Persistent reading of tags changed to: "+webState);
    console.log("Persistent reading of tags changed to: "+webState);
    if ( webState == true ){
      persistentReadEventOld.emit("state on");
    }else{
      persistentReadEventOld.emit("state off");
    }
  });

  app.get('/persistentReadToDB/:terminateTime', function(req, res){
    // dump entire DB into html
    var terminateTime = req.params.terminateTime
    webState = false;
    console.log("Persistent reading of tags changed to: "+webState);
    persistentReadEventOld.emit("state timed", null, terminateTime);
    res.send("Persistent reading of tags enabled for " + terminateTime + " seconds.");
  });

}else{

}




// Not tested!!!
//echo BB-UART1 > /sys/devices/bone_capemgr*/slots
