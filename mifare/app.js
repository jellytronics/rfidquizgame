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

mongoose.connect('mongodb://beagleserver/test');
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
    messageDB.save(function (err){if (err) {returnconsole.error(err)}});
  });
}


function readFromDB(){
  MessageDB.find(function (err, messageDB){
    if (err) return console.error(err);
      console.log(messageDB);
  })
}









// CILENT Side

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.send('App up and running!');
});

app.get('/readUid', function(req, res){
  res.send();
});

app.get('/writeMessage', function(req, res){
  res.send('App up and running!');
});

app.get('/readUid', function(req, res){
  res.send();
});
