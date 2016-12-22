const PORT=7777; 
const GAME_SPEED = 3;

// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var moment = require('moment');
var numeral = require('numeral');
var _ = require('underscore');

app.use(express.static(__dirname + '/'));  

app.get('/', function(req, res,next) {  
		res.sendFile(__dirname + '/index.html');
});


/* api */

var price = 0;
var multiplier = Math.random() - 0.5;
var intensifier = Math.random() * 2;
var startDate = moment("01-Jan-14", "DD-MMM-YY");
var i = 0;
var data = [];

// price changes every 3s
setInterval(function() {

		if(i % 4 == 0) { multiplier = Math.random() - 0.5; }
		if(i % 7 == 0) { intensifier = Math.random() * 2; }

		price += (Math.random() * multiplier) * intensifier;
		var date = startDate.add(1, "days") 

	console.log("price update ---  £", price);

	i++;

}, 3000)


var holdings = [
		{
			name: "kappisan",
			price: 200,
			sedol: "123456",
			ticker: "KA",
			quantity: 4000,
			bookCost: 300,
			bookValue: 3333
		},
		{
			name: "Maverick Media",
			price: 345,
			sedol: "333333",
			ticker: "MM",
			quantity: 250,
			bookCost: 4000,
			bookValue: 4200
		},
		{
			name: "Amiris Cannabis",
			price: 77,
			sedol: "555555",
			ticker: "ACB",
			quantity: 4000,
			bookCost: 850,
			bookValue: 849
		}];



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


var transactions = [{
		id: "abcdef12345678",
		date: "11-Sept-2001", 
		quantity: 200,
		bookCost: 23333,
		pricePaid: 100,
		stock: {
					name: "Casablanca",
					price: 123,
					sedol: "123456",
					ticker: "CSB",
					sharesIssued: 4000,
					marketCap: 200000,
					currency: "GBP",
					volume: 10000
			}
	}]
// returns a list of all stocks on the exchange
app.post('/api/transactions', function (req, res) {

	res.send(transactions);
	
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

var users = [
	{
		username: "kasper",
		name: "Kasper Wilkosz",
		id: 1,
		netWorth: 500000,
		image: './img/me.jpg',
		holdings: []
	},
	{
		username: "alex",
		name: "Alex Richardson",
		id: 2,
		netWorth: 200000,
		image: './img/alex.jpg',
		holdings: []
	},
	{
		username: "gordon",
		name: "Gordon Gekko",
		id: 3,
		netWorth: 850000,
		image: './img/gordon.jpg',
		holdings: []
	},
	{
		username: "budfox",
		name: "Bud Fox",
		id: 4,
		netWorth: 850000,
		image: './img/budfox.jpg',
		holdings: []
	},
	{
		username: "belfort",
		name: "Jordan Belfort",
		id: 5,
		netWorth: 1850000,
		image: './img/belfort.jpg'
	}
];


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

		if(stock.valuations.length < 1) { // if no data generate some
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

			stock.price = numeral(lastVal).format('0,0.00');
			stock.marketCap = numeral(lastVal * stock.sharesIssued).format('0,0.00');
		}

	});

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