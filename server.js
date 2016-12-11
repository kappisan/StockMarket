const PORT=7777; 

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')

var app = express();

app.use(express.static('./'));


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var recipes = [];


app.get('/api/recipes', function (req, res) {


	res.send(recipes);
});


server = app.listen(PORT);

var host = server.address().address
var port = server.address().port

console.log("stock simulator server listening on port %s", port);