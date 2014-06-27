var ndef = require('ndef'), mifare = require('mifare-classic'), message, bytes

message = [
	ndef.textRecord("Hello from nodejs")
]

bytes = ndef.encodeMessage(message)

mifare.write(bytes, function(err) {
	if (err) {
		console.log("Write failed ")
		console.log(err)
		return
	}
	console.log("OK")
})
