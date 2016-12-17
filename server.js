// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var moment = require('moment');

app.use(express.static(__dirname + '/'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});


/* stocks */
var kappisan = {
	price: 240,
	currency: "GBX",
	valuations: []
};



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









/* socket.io */

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

	setInterval(function() {
		client.emit("price", price);
	}, 3000);

});













server.listen(7777);  

// const PORT=7777; 



// /* socket io */

// io.on('connection', function(client) {  
//     console.log('Client connected...');

//     client.on('join', function(data) {
//         console.log(data);
//     });

// });








// var users = [];

// app.get('/api/users', function (req, res) {

// 	res.send(users);
// });


// /* start server */

// server = app.listen(PORT);

// var host = server.address().address
// var port = server.address().port

// console.log("stock simulator server listening on port %s", port);