var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes
var os = require('os')


console.log(os.hostname())

console.log("noob")

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
