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

	var holdings = {
		cash: 0,
		holdings: []
	};

	function getSecurities(user) {
		securitiesDB.find({owner: user}).toArray((err, results) => {
			if(err) return;
			//console.log("db get all stocks", results);
			holdings = {
				cash: 1200,
				holdings: results
			};
		});
	}

	getSecurities("alex");


	var statementsDB = db.collection('statements');
	var statements;
	statementsDB.find({}).toArray((err, results) => {
		if(err) return;

		//console.log("db get all stocks", results);
		statements = results;
	});

	app.get('/', function(req, res,next) {  
		res.sendFile(__dirname + '/index.html');
	});


	/* api */
	var startDate = moment("01-Jan-14", "DD-MMM-YY");

	app.get('/api/holdings', function(req, res,next) {  
		res.send(holdings);
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
		res.send(statements);
	})

	app.post('/api/login', function (req, res) {

		var userObject = req.body;
		userObject.uuid = "123456789";

		console.log("/api/login", userObject);

		res.send(userObject);
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

		// update holdings
		securitiesDB.find({}).toArray((err, results) => {
			if(err) return;

			//console.log("db get all stocks", results);
			holdings = {
				cash: 1200,
				holdings: results
			};
		});




			// update balance

			res.send("successfully bought");
			
	})

		var funds = [{
						name: "kappisan fund",
						price: 3929,
						sedol: "123456",
						ticker: "KAF",
						sharesIssued: 5000000,
						marketCap: 22700000,
						volume: 10000,
						type: "fund"
					},{
						name: "Maverick Media finance",
						price: 2546,
						sedol: "333333",
						ticker: "MMF",
						sharesIssued: 4000,
						marketCap: 31000000,
						volume: 10000,
						type: "fund"
					},{
						name: "Kaspers Piggy Bank",
						price: 210,
						sedol: "222222",
						ticker: "KPB",
						sharesIssued: 4000,
						marketCap: 230000,
						volume: 10000,
						type: "fund"
					},{
						name: "Get Rich or Die Tying",
						price: 22,
						sedol: "444444",
						ticker: "GRDT",
						sharesIssued: 4000,
						marketCap: 99999999,
						volume: 10000,
						type: "fund"
					}];

		// returns a list of all stocks on the exchange
		app.get('/api/funds', function (req, res) {
			res.send(funds);
		})

		app.get('/api/stocks', function (req, res) {
			res.send(stocks);
		})

		app.get('/api/users', function (req, res) {
			res.send(users);
		})

		app.get('/api/user', function (req, res) {

			console.log("get user", req.query.username);

			var user = _.findWhere(users, { username: req.query.username })

			res.send(user);

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

			if(!holdings.holdings) return;

			holdings.holdings.forEach(function(holding) {
				var matchStock = _.findWhere(stocks, { ticker: holding.ticker })

				if(!matchStock) return;

				holding.bookValue = matchStock.priceRaw;
				holding.price = matchStock.price;
			})


		}, 3000);

		/* socket.io */

		io.on('connection', function(client) {  
			console.log('Client connected...');

			client.on('get holdings', function(data) {
				client.emit("holdings", holdings);
			});

			client.on('get funds', function(data) {
				client.emit("funds", funds);
			});

			client.on('get stocks', function(data) {
				client.emit("stocks", stocks);
			});

			client.on('get stock', function(sedol) {
				console.log("get stock by sedol");
				var sedolStock = _.findWhere(stocks, { sedol: sedol }) 
				client.emit("stock", sedolStock);
			});


			client.on('get valuation', function(sedol) {
				console.log("get valuations by sedol");
				var sedolValuations = _.findWhere(stocks, { sedol: sedol }) 

				if(!sedolValuations) return;

				client.emit("valuations", sedolValuations.valuations);
			});

			setInterval(function() {

				//client.emit("valuations", valuations);

				client.emit("holdings", holdings);

				client.emit("stocks", stocks);

			}, 3000);

		});




		// /* start server */

		server.listen(PORT);  

		var host = server.address().address
		var port = server.address().port

		console.log("stock simulator server listening on port %s", port);
});