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
