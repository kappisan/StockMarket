var statements = [
    	{
    		type: "Buy",
    		amount: 32,
    		sedol: "333333",
    		name: "Maverick Media",
    		price: 4523,
    		date: "2016-Dec-01",
    		time: "10:17:12",
    		user: "kasper",
    		fee: 0
    	},
    	{
    		type: "Sell",
    		amount: 300,
    		sedol: "123456",
    		name: "kappisan",
    		price: 4523,
    		date: "2016-Dec-01",
    		time: "10:17:17",
    		user: "kasper",
    		fee: 0
    	},
    	{
    		type: "Sell",
    		amount: 300,
    		sedol: "123456",
    		name: "Maverick Media",
    		price: 4523,
    		date: "2016-Dec-01",
    		time: "13:12:47",
    		user: "alex",
    		fee: 0
    	}
    ]

fs = require('fs');
fs.writeFile('statements.json', JSON.stringify(statements), function (err) {

  if (err) return console.log(err);

  console.log('statements > statements.txt');
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