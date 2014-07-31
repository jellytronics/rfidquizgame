// Mifare Init
var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes
var os = require('os')
var events = require("events");
var EventEmitter = require("events").EventEmitter;

// Events Tutorial
// http://code.tutsplus.com/tutorials/using-nodes-event-module--net-35941


// MIFARE STUFF

var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes

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


function writeMifare(message){
  bytes = ndef.encodeMessage(message);
  mifare.write(bytes, function(err) {
    if (err) {
      return
    }
    console.log("data written")
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

function writeCard(name, teamNumber, answerNumber){
  message = [
    ndef.textRecord(name),
    ndef.textRecord(teamNumber.toString()),
    ndef.textRecord(answerNumber.toString())
  ]
  writeMifare(message);
}






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
  console.log("Success");
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
    if (err){return}
    var messageRead = ndef.decodeMessage(buffer.toJSON())
    if (messageRead == undefined || messageRead[0] == undefined) { return; };
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




var defaultTimeInterval = 500;

var persistentReadfunction;

var persistentReadEvent = new EventEmitter();

persistentReadEvent.on("state on", function (timeInterval) {
  if ( typeof timeInterval == 'undefined' ) { timeInterval = defaultTimeInterval; }
  persistentReadfunction = setInterval(function(err){ console.log("WTF"+new Date().getTime()); readToDB() }, timeInterval);
  console.log("persistentReadToDB activated");
});

persistentReadEvent.on("state off", function () {
  clearInterval(persistentReadfunction);
  console.log("persistentReadToDB deactivated");
});






/*



persistentReadEvent.on("state on", function (timeInterval) {
  if ( typeof timeInterval == 'undefined' ) { timeInterval = defaultTimeInterval; }
  persistentReadfunction = setInterval(function(err){ readToDB(); }, timeInterval);
  console.log("persistentReadToDB activated");
});

persistentReadEvent.on("state off", function () {
  clearInterval(persistentReadfunction);
  console.log("persistentReadToDB deactivated");
});

----


function persistentReadToDB(timeInterval, stateFunction){
  if ( typeof timeInterval == 'undefined' ) { timeInterval = defaultTimeInterval; }
  if ( typeof stateFunction == 'undefined' ) { console.log("Input Error"); return }
  var noob = setInterval(function(err){ readToDB(); }, timeInterval)
  while(stateFunction()){

  }
  if (noob == undefined) { return };
  clearInterval(noob);
  return;
}

*/









var app = express();

// all environments
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

app.get('/readCard', function(req, res){
  console.log("Reading Card");
  readToDB(function(card){
    res.send(card);
    console.log(card);
  })
});




// CILENT Side

if (os.hostname() != "beagleserver"){

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
      persistentReadEvent.emit("state on");
    }else{
      persistentReadEvent.emit("state off");
    }
  });

}else{

}




// Not tested!!!
