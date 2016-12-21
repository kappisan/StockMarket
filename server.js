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







var stocks = [{
        name: "kappisan",
        price: 3929,
        sedol: "123456",
        ticker: "KA",
        sharesIssued: 5000000,
        marketCap: 22700000,
        volume: 10000,
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
      },{
        name: "Maverick Media",
        price: 2546,
        sedol: "333333",
        ticker: "MM",
        sharesIssued: 4000,
        marketCap: 31000000,
        volume: 10000,
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
      },{
        name: "Big Belly Burger",
        price: 210,
        sedol: "222222",
        ticker: "BBB",
        sharesIssued: 4000,
        marketCap: 230000,
        volume: 10000,
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
      },{
        name: "BC Rich",
        price: 22,
        sedol: "444444",
        ticker: "BCR",
        sharesIssued: 4000,
        marketCap: 99999999,
        volume: 10000,
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
      },{
        name: "Amiris Cannabis",
        price: 520,
        sedol: "555555",
        ticker: "ACB",
        sharesIssued: 4000,
        marketCap: 99999999,
        volume: 10000,
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
    },{
        name: "Orange Soda",
        price: 167,
        sedol: "66666",
        ticker: "OGS",
        sharesIssued: 80000,
        marketCap: 400000,
        volume: 10000,
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
    },{
        name: "Casablanca",
        price: 123,
        sedol: "777777",
        ticker: "CSB",
        sharesIssued: 80000,
        marketCap: 300000,
        volume: 10000,
        type: "stock",
        president:   {
            username: "kasper",
            name: "Kasper Wilkosz",
            id: 1,
            netWorth: 500000,
            image: './img/me.jpg'
        },
        vicePresident: {
          username: "gordon",
          name: "Gordon Gekko",
          id: 3,
          netWorth: 850000,
          image: './img/gordon.jpg'
        },
        directors: []
    },{
        name: "Relax & Revive",
        price: 123,
        sedol: "888888",
        ticker: "RRV",
        sharesIssued: 4000,
        marketCap: 200000,
        volume: 10000,
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
    image: './img/me.jpg'
  },
  {
    username: "alex",
    name: "Alex Richardson",
    id: 2,
    netWorth: 200000,
    image: './img/alex.jpg'
  },
  {
    username: "gordon",
    name: "Gordon Gekko",
    id: 3,
    netWorth: 850000,
    image: './img/gordon.jpg'
  },
  {
    username: "budfox",
    name: "Bud Fox",
    id: 4,
    netWorth: 850000,
    image: './img/budfox.jpg'
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




var prices = {
  KA: 3929,
  MM: 2546,
  BBB: 210,
  BCR: 22,
  ACB: 520,
  OGS: 167,
  CSB: 123,
  RRV: 123
}

setInterval(function() {

    for (var pr in prices) {
        // skip loop if the property is from prototype
        if(!prices.hasOwnProperty(pr)) continue;

        
        prices[pr]++;
    }
}, 3000);

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

      client.emit("prices", prices);

      client.emit("price", price);

      client.emit("funds", funds);

      client.emit("holdings", holdings);
    }, 3000);

});





// /* start server */

server.listen(PORT);  

var host = server.address().address
var port = server.address().port

console.log("stock simulator server listening on port %s", port);