
var stocks = [
			{
				name: "kappisan",
				price: 3929,
				sedol: "123456",
				ticker: "KA",
				sharesIssued: 5000000,
				marketCap: 22700000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president:   {
						username: "kasper",
						name: "Kasper Wilkosz",
						id: 1,
						netWorth: 500000,
						image: './img/me.jpg'
				},
				vicePresident: {
					username: "alex",
					name: "Alex Richardson",
					id: 2,
					netWorth: 200000,
					image: './img/alex.jpg'
				},
				directors: []
			},
			{
				name: "Maverick Media",
				price: 2546,
				sedol: "333333",
				ticker: "MM",
				sharesIssued: 4000,
				marketCap: 31000000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president: {
					username: "alex",
					name: "Alex Richardson",
					id: 2,
					netWorth: 200000,
					image: './img/alex.jpg'
				},
				vicePresident: {
						username: "kasper",
						name: "Kasper Wilkosz",
						id: 1,
						netWorth: 500000,
						image: './img/me.jpg'
				},
				directors: []
			},
			{
				name: "Big Belly Burger",
				price: 210,
				sedol: "222222",
				ticker: "BBB",
				sharesIssued: 4000,
				marketCap: 230000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president: {
					username: "gordon",
					name: "Gordon Gekko",
					id: 3,
					netWorth: 850000,
					image: './img/gordon.jpg'
				},
				vicePresident: {
					username: "budfox",
					name: "Bud Fox",
					id: 4,
					netWorth: 850000,
					image: './img/budfox.jpg'
				},
				directors: []
			},
			{
				name: "BC Rich",
				price: 22,
				sedol: "444444",
				ticker: "BCR",
				sharesIssued: 4000,
				marketCap: 6000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president: {
					username: "gordon",
					name: "Gordon Gekko",
					id: 3,
					netWorth: 850000,
					image: './img/gordon.jpg'
				},
				vicePresident: {
					username: "belfort",
					name: "Jordan Belfort",
					id: 5,
					netWorth: 1850000,
					image: './img/belfort.jpg'
				},
				directors: []
			},
			{
				name: "Amiris Cannabis",
				price: 520,
				sedol: "555555",
				ticker: "ACB",
				sharesIssued: 4000,
				marketCap: 5000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president:   {
						username: "kasper",
						name: "Kasper Wilkosz",
						id: 1,
						netWorth: 500000,
						image: './img/me.jpg'
				},
				vicePresident: {
					username: "alex",
					name: "Alex Richardson",
					id: 2,
					netWorth: 200000,
					image: './img/alex.jpg'
				},
				directors: []
		},
		{
				name: "Orange Soda",
				price: 167,
				sedol: "66666",
				ticker: "OGS",
				sharesIssued: 80000,
				marketCap: 400000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president: {
					username: "gordon",
					name: "Gordon Gekko",
					id: 3,
					netWorth: 850000,
					image: './img/gordon.jpg'
				},
				vicePresident: {
					username: "alex",
					name: "Alex Richardson",
					id: 2,
					netWorth: 200000,
					image: './img/alex.jpg'
				},
				directors: []
		},
		{
				name: "Casablanca",
				price: 123,
				sedol: "777777",
				ticker: "CSB",
				sharesIssued: 80000,
				marketCap: 300000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president:   {
					username: "belfort",
					name: "Jordan Belfort",
					id: 5,
					netWorth: 1850000,
					image: './img/belfort.jpg'
				},
				vicePresident: {
					username: "gordon",
					name: "Gordon Gekko",
					id: 3,
					netWorth: 850000,
					image: './img/gordon.jpg'
				},
				directors: []
		},
		{
				name: "Relax & Revive",
				price: 123,
				sedol: "888888",
				ticker: "RRV",
				sharesIssued: 4000,
				marketCap: 200000,
				volume: 10000,
				valuations: [],
				type: "stock",
				president: {
					username: "gordon",
					name: "Gordon Gekko",
					id: 3,
					netWorth: 850000,
					image: './img/gordon.jpg'
				},
				vicePresident: {
					username: "alex",
					name: "Alex Richardson",
					id: 2,
					netWorth: 200000,
					image: './img/alex.jpg'
				},
				directors: []
		}];


fs = require('fs');
fs.writeFile('stocks.json', JSON.stringify(stocks), function (err) {

  if (err) return console.log(err);

  console.log('stocks > stocks.txt');
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