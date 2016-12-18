const PORT=7777; 

// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var moment = require('moment');
var _ = require('underscore');

app.use(express.static(__dirname + '/'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});


/* api */

var price = (Math.random() * 10) + 4100;
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

    //data.push({date: date.format("DD-MMM-YY"), close: price});    

	console.log("price update ---  £", price);

	i++;

}, 3000)


var holdings = [{
      name: "kappisan",
      price: 200,
      sedol: "123456",
      ticker: "KA",
      quantity: 4000,
      bookCost: 300,
      bookValue: 33333
    },{
      name: "Maverick Media",
      price: 345,
      sedol: "123456",
      ticker: "MM",
      quantity: 250,
      bookCost: 4000,
      bookValue: 4200
    },{
      name: "BC Rich",
      price: 233,
      sedol: "123456",
      ticker: "BCR",
      quantity: 10000,
      bookCost: 600,
      bookValue: 562
    },{
      name: "Amiris Cannabis",
      price: 77,
      sedol: "123456",
      ticker: "ACB",
      quantity: 4000,
      bookCost: 850,
      bookValue: 849
    }];







/* socket.io */

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('get holdings', function(data) {
        client.emit("holdings", holdings);
    });

	setInterval(function() {
		client.emit("price", price);
	}, 3000);

	setInterval(function() {
		client.emit("holdings", holdings);
	}, 10000);

});






var stocks = [{
        name: "kappisan",
        price: 1999,
        sedol: "123456",
        ticker: "KA",
        sharesIssued: 4000,
        marketCap: 99999999,
        currency: "GBP",
        volume: 10000
      },{
        name: "Big Belly Burger",
        price: 210,
        sedol: "222222",
        ticker: "BBB",
        sharesIssued: 4000,
        marketCap: 99999999,
        currency: "GBP",
        volume: 10000
      },{
        name: "Maverick Media",
        price: 999,
        sedol: "333333",
        ticker: "MM",
        sharesIssued: 4000,
        marketCap: 99999999,
        currency: "GBP",
        volume: 10000
      },{
        name: "BC Rich",
        price: 999,
        sedol: "444444",
        ticker: "BCR",
        sharesIssued: 4000,
        marketCap: 99999999,
        currency: "GBP",
        volume: 10000
      },{
        name: "Amiris Cannabis",
        price: 999,
        sedol: "555555",
        ticker: "ACB",
        sharesIssued: 4000,
        marketCap: 99999999,
        currency: "GBP",
        volume: 10000
    },{
        name: "Orange Soda",
        price: 123,
        sedol: "66666",
        ticker: "OGS",
        sharesIssued: 4000,
        marketCap: 200000,
        currency: "GBP",
        volume: 10000
    },{
        name: "Casablanca",
        price: 123,
        sedol: "777777",
        ticker: "CSB",
        sharesIssued: 4000,
        marketCap: 200000,
        currency: "GBP",
        volume: 10000
    },{
        name: "Relax & Revive",
        price: 123,
        sedol: "888888",
        ticker: "RRV",
        sharesIssued: 4000,
        marketCap: 200000,
        currency: "GBP",
        volume: 10000
    }];

// returns a list of all stocks on the exchange
app.get('/api/stocks', function (req, res) {

	res.send(stocks);

})

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





// /* start server */

server.listen(PORT);  

var host = server.address().address
var port = server.address().port

console.log("stock simulator server listening on port %s", port);