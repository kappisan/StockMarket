var connections = [
    	{
    		user1: "kasper",
    		user2: "alex",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "kasper",
    		user2: "gordon",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "kasper",
    		user2: "belfort",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "kasper",
    		user2: "budfox",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "alex",
    		user2: "budfox",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "alex",
    		user2: "gordon",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	},
    	{
    		user1: "gordon",
    		user2: "budfox",
    		date: "2016-Dec-01",
    		time: "10:17:12"
    	}
    ]

fs = require('fs');
fs.writeFile('connections.json', JSON.stringify(connections), function (err) {

  if (err) return console.log(err);

  console.log('connections > connections.txt');
});











/*

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");

    users.forEach(function(user) {

	    db.stocksimulator.users.save(user);

    })



  }
});

*/