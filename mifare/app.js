//Mifare Part
var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes
var os = require('os')

//Server part
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');


var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("echo BB-UART1 > /sys/devices/bone_capemgr*/slots", puts);






var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.send('App up and running!');
});

app.get('/readuid', function(req, res){
  res.send();
});


















var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes

mifare.read(function(err, buffer) {
    if (err) {
        console.log("Read failed ")
        console.log(err)
        return
    }
    //TODO handle empty buffer!
    var message = ndef.decodeMessage(buffer.toJSON())
    console.log("Found NDEF message with " + message.length + (message.length === 1 ? " record" : " records" ))
    console.log(ndef.stringify(message))
})








console.log(os.hostname())

message = [
  ndef.textRecord("Hello from nodejs"),
  ndef.record(ndef.TNF_EXTERNAL_TYPE, 'android.com:pkg' , [], 'com.joelapenna.foursquared')
]

console.log("noob2")

bytes = ndef.encodeMessage(message)

console.log("noob2a")

/*
mifare.format(function(err) {
  if (err) {
    console.log("Formmating failed")
    console.log(err)
    return
  }
  console.log("card formatted")
})

console.log("noob3")
*/

/*
mifare.write(bytes, function(err) {
  if (err) {
    console.log("Write failed ")
    console.log(err)
    return
  }
  console.log("data written")
})

console.log("noob4")
*/



mifare.read(function(err, buffer) {
  if (err) {
    console.log("Read failed ")
    console.log(err)
    return
  }
  //TODO handle empty buffer!
  var message = ndef.decodeMessage(buffer.toJSON())
  console.log("Found NDEF message with " + message.length + (message.length === 1 ? " record" : " records" ))
  console.log(ndef.stringify(message))
})

console.log("noob5")
