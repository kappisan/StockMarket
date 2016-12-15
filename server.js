const PORT=7777; 

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');




/* config */

var app = express();

app.use(express.static('./'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


/* stocks */
var kappisan = {
	price: 240,
	currency: "GBX",
	valuations: []
};


/* api */

var price = (Math.random() * 10) + 4100;
var multiplier = Math.random() - 0.5;
var startDate = moment("01-Jan-14", "DD-MMM-YY");
var i = 0;
var data = [];

setInterval(function() {

    if(i % 4 == 0) { multiplier = Math.random() - 0.5; }

    price += (Math.random() * multiplier);
    var date = startDate.add(1, "days")

    //data.push({date: date.format("DD-MMM-YY"), close: price});    

	console.log("price update ---  £", price);

	i++;

}, 1000)















var users = [];

app.get('/api/users', function (req, res) {

	res.send(users);
});


/* start server */

server = app.listen(PORT);

var host = server.address().address
var port = server.address().port

console.log("stock simulator server listening on port %s", port);