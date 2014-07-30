// Mifare Init
var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes
var os = require('os')


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
  if (answerInstance == undefined) { return; };
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

//mongoose.connect('mongodb://beagleserver/test');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Success");
});

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

function readToDB(){
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
    return messageDB;
  });
}


function readFromDB(callback){
  var queryObj;
  if (callback == undefined){
    queryObj = MessageDB.find(function (err, messageDB){
      if (err) return console.error(err);
        console.log(messageDB);
    })
    return;
  }
  queryObj = MessageDB.find(callback)
}

var defaultTimeInterval = 30;

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

function readAllFromDB(){

}










var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.send('App up and running!');
});


app.get('/readDB'){
  // dump entire DB into html
  res.send(readFromDB());
}

var webState = false;
var defaultTimeInterval = 30;

var webStateFunction = function(){
  return !webstate
}

app.get('/persistentReadToDB'){
  // dump entire DB into html
  console.log("persistenReadDB accessed.");
  webState = ! webState;
  res.send("Persistent reading of tags changed to: "+webState);
  console.log("Persistent reading of tags changed to: "+webState);
  if ( webState == true ){
    if ( typeof req.params.timeInterval == 'undefined' || isNaN(req.params.timeInterval) ) {
      persistentReadToDB( webStateFunction( defaultTimeInterval, webStateFunction()));
    }else{
      persistentReadToDB( webStateFunction( timeInterval, webStateFunction()));
    }
  }
}

// CILENT Side

if (os.hostname() != "beagleserver"){

  app.get('/readCard', function(req, res){
    console.log("Rading Card");
    res.send(readToDB());
  });

  app.get('/writeCard', function(req, res){
    res.send(writeCard(req.params.name, req.params.teamNumber, req.params.answerNumber));
  });

}else{
  
}











persistentReadFromDB(webStateFunction)
