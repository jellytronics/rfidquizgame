console.log(__filename);
console.time('Start time');

var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');

var mongoose = require('mongoose');
var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  //replset: { rs_name: 'myReplicaSetName' },
  //user: 'myUserName',
  //pass: 'myPassword'
};
options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
var uri = 'mongodb://localhost/test';
mongoose.connect(uri, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// yay!
	console.log('Db running loh!');
	var kittySchema = mongoose.Schema({
		name: String
	})

	var Kitten = mongoose.model('Kitten', kittySchema)


	var silence = new Kitten({ name: 'Silence' })
	console.log(silence.name) // 'Silence'


	// NOTE: methods must be added to the schema before compiling it with mongoose.model()
	kittySchema.methods.speak = function () {
		var greeting = this.name
		? "Meow name is " + this.name
		: "I don't have a name"
		console.log(greeting);
	}

	var Kitten = mongoose.model('Kitten', kittySchema)

	var fluffy = new Kitten({ name: 'fluffy' });
	fluffy.speak() // "Meow name is fluffy"

	fluffy.save(function (err, fluffy) {
		if (err) return console.error(err);
		fluffy.speak();
	});

	Kitten.find(function (err, kittens) {
		if (err) return console.error(err);
		console.log(kittens)
	})

	Kitten.find({ name: /^Fluff/ }, callback)
});






console.time('End time');


