console.log(__filename);
console.time('Start time');

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }else{
  	return console.dir(err);
  }

});


/*
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('test');
  var doc = {mykey:1, fieldtoupdate:1};

  collection.insert(doc, {w:1}, function(err, result) {
    collection.update({mykey:1}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {});
  });

  var doc2 = {mykey:2, docs:[{doc1:1}]};

  collection.insert(doc2, {w:1}, function(err, result) {
    collection.update({mykey:2}, {$push:{docs:{doc2:1}}}, {w:1}, function(err, result) {});
  });
});
*/
