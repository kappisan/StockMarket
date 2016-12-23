var holdings = 	[
				{
					name: "kappisan",
					owner: "kasper",
					price: 200,
					sedol: "123456",
					ticker: "KA",
					quantity: 100,
					bookCost: 300,
					bookValue: 3333
				},
				{
					name: "Maverick Media",
					owner: "kasper",
					price: 345,
					sedol: "333333",
					ticker: "MM",
					quantity: 250,
					bookCost: 4000,
					bookValue: 4200
				},
				{
					name: "Amiris Cannabis",
					owner: "kasper",
					price: 77,
					sedol: "555555",
					ticker: "ACB",
					quantity: 2000,
					bookCost: 850,
					bookValue: 849
				}
			]

fs = require('fs');
fs.writeFile('holdings.json', JSON.stringify(holdings), function (err) {

  if (err) return console.log(err);

  console.log('holdings > holdings.txt');
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