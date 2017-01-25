const PORT=7777; 
const GAME_SPEED = 3;

// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var moment = require('moment');
var numeral = require('numeral');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;

app.use(express.static(__dirname + '/'));  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


MongoClient.connect("mongodb://localhost:27017/stocksimulator", function(err, db) {

	if(err) return;
	console.log("We are connected");

	var connectionsDB = db.collection('connections');
	var userDB = db.collection('users');
	var users;

	userDB.find({}).toArray((err, results) => {
		if(err) return;

		//console.log("db get all users", results);
		users = results;

	});


	var stocksDB = db.collection('stocks');
	var stocks;
	stocksDB.find({}).toArray((err, results) => {
		if(err) return;

		//console.log("db get all stocks", results);
		stocks = results;
	});



	var securitiesDB = db.collection('securities');
	var securities;

	var statementsDB = db.collection('statements');

	app.get('/', function(req, res,next) {  
		res.sendFile(__dirname + '/index.html');
	});


	/* api */
	var startDate = moment("01-Jan-14", "DD-MMM-YY");

	app.post('/api/holdings', function(req, res, next) {  
		console.log("get holdings for", req.body)

		userDB.find({username: req.body.username}).toArray((usersErr, userResults) => {
			if(usersErr || !userResults[0]) return;

			securitiesDB.find({owner: req.body.username}).toArray((err, holdingsResults) => {
				if(err) return;

				if(!holdingsResults) return;

				holdingsResults.forEach(function(holding) {
					var matchStock = _.findWhere(stocks, { ticker: holding.ticker })

					if(!matchStock) return;

					holding.bookValue = matchStock.price * holding.quantity;
					holding.price = matchStock.price;
				})


				holdings = {
					cash: userResults[0].cash,
					holdings: holdingsResults
				};

				res.send(holdings);
			});
		});
	});


	// returns a list of all stocks on the exchange
	app.get('/api/stock', function (req, res) {

		console.log('get stock by sedol', req.query);

		var match;

		if(req.query.sedol) {
			match = _.findWhere(stocks, {sedol: req.query.sedol});
		} else if (req.query.name) {
			match = _.findWhere(stocks, {name: req.query.name});
		} else if (req.query.ticker) {
			match = _.findWhere(stocks, {ticker: req.query.ticker});
		}

		if(match) {
			res.send(match);
		} else {
			res.send({ name: "no stock found" })
		}
	})



	// returns a list of all stocks on the exchange
	app.post('/api/transactions', function (req, res) {

		res.send([]);
		
	})

	// returns a list of all stocks on the exchange
	app.post('/api/statements', function (req, res) {
		console.log("get statements by user", req.body.username);

		statementsDB.find({user: req.body.username}).toArray((err, results) => {
			if(err) return;

			res.send(results);
		});


	})

	app.post('/api/login', function (req, res) {

		var userObject = req.body;

		console.log("/api/login", userObject);

		var userMatch = _.findWhere(users, { username: req.body.username })

		if(!userMatch) {

			res.send({status: false});

		} else {

			userObject.uuid = "123456789";
			userObject.status = true;

			res.send(userObject);
		}
	})


	app.post('/api/buyStock', function (req, res) {

		console.log("buy stock", req.body)

		securitiesDB.insert({
			name: req.body.name,
			owner: req.body.user,
			price: req.body.transaction.paid,
			name: req.body.name,	
			sedol: req.body.sedol,
			bookCost: req.body.transaction.value,
			bookValue: req.body.transaction.value,
			ticker: req.body.ticker,
			quantity: req.body.transaction.volume
		})
		

		var now = moment();
		statementsDB.insert({
			type: "Buy",
			amount: req.body.transaction.volume,
			sedol: req.body.sedol,
			name: req.body.name,
			price: req.body.transaction.paid,
			date: now.format("YYYY-MMM-DD"),	
			time: now.format("hh:mm:ss"),
			user: req.body.user,
			fee: 0
		})


		// update holdings
		securitiesDB.find({}).toArray((err, results) => {
			if(err) return;

			//console.log("db get all stocks", results);
			holdings = {
				cash: 1200,
				holdings: results
			};
		});

		res.send("successfully bought");
			
	})

	app.post('/api/sellStock', function (req, res) {

		console.log("sell stock", req.body);

		// first check how much stock we have
		securitiesDB.find({owner: req.body.user, ticker: req.body.ticker}).toArray((err, results) => {
			if(err) return;

			console.log("db match holding", results);

			if(results[0].quantity > req.body.transaction.volume) {
				// update
				var newAmount = results[0].quantity - req.body.transaction.volume;
				securitiesDB.update({owner: req.body.user, ticker: req.body.ticker}, {quantity: newAmount});
			} else {
				// delete
				securitiesDB.remove({owner: req.body.user, ticker: req.body.ticker});
			}
		});

		var now = moment();
		statementsDB.insert({
			type: "Sell",
			amount: req.body.transaction.volume,
			sedol: req.body.sedol,
			name: req.body.name,
			price: req.body.transaction.paid,
			date: now.format("YYYY-MMM-DD"),	
			time: now.format("hh:mm:ss"),
			user: req.body.user,
			fee: 0
		})

		res.send("successfully sold");
			
	})


		app.get('/api/stocks', function (req, res) {
			res.send(stocks);
		})

		app.get('/api/users', function (req, res) {
			res.send(users);
		})

		app.post('/api/user', function (req, res) {

			console.log("/api/user req", req.body)

			userDB.find({username: req.query.username}).toArray((err, results) => {
				if(err) return;

				connectionsDB.find({$or: [ {user1: req.query.username}, {user2: req.query.username}  ] }).toArray((err, connections) => {
				
					if(results.length < 1) {
						return res.send({username: "not found", bio: ""})
					} 

					connectionsDB.find({$or: [ {user1: req.query.username, user2: req.body.me}, {user1: req.body.me, user2: req.query.username}  ] }).toArray((err, friend) => {

						var isFriend = (friend.length != 0);

						user = results[0];

						var connectionUsernames = [];

						connections.forEach( function(d) {
							connectionUsernames.push(d.user1);
							connectionUsernames.push(d.user2);
						});

						connectionUsernames = _.without(_.uniq(connectionUsernames), req.query.username);

						userDB.find({username: {$in: connectionUsernames }}).toArray((err, friends) => {

							if(!friends) friends = [];

							user.connections = friends;
							user.isFriend = isFriend;
							res.send(user);
						});
					});
				});
			});
		})


		var now = moment();

		console.log("now", now);


		function generateData(startPrice, interval) {

			var startDate = now.subtract(100 * interval, "seconds");

			var data = [];

			var price = startPrice;
			var multiplier = Math.random() - 0.5;

			for(var i = 0; i < 100; i++) {

				if(i % 4 == 0) { multiplier = Math.random() - 0.5; }

				price += (Math.random() * multiplier);
				var date = startDate.add(interval, "seconds")

				data.push({
					time: date.format('hh:mm:ss'), 
					date: date.format("DD-MMM-YY"), 
					close: price
				});        
			}

			return data;
		}

		setInterval(function() {

			// go over each stock and calculate the new price
			stocks.forEach(function(stock) {

				if(!stock.valuations || stock.valuations.length < 1) { // if no data generate some
					stock.valuations = generateData(stock.price, GAME_SPEED);
				} else {

					var lastVal = stock.valuations[stock.valuations.length - 1].close;

					var multiplier = Math.random() - 0.5;
					lastVal += (Math.random() * multiplier);

					stock.valuations.shift();
					stock.valuations.push({
						date: moment().format("DD-MMM-YY"), 
						time: moment().format("hh:mm:ss"), 
						close: lastVal 
					});

					stock.priceRaw = lastVal;
					stock.price = numeral(lastVal).format('0,0.00');
					stock.marketCap = numeral(lastVal * stock.sharesIssued).format('0,0.00');
				}

			});

		}, 3000);

		// /* start server */

		server.listen(PORT);  

		var host = server.address().address
		var port = server.address().port

		console.log("stock simulator server listening on port %s", port);
});