var express = require('express');
var app = express();
var port = 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.htm');
});

var server = app.listen(port, function() {
    console.log('Server listening on port ' + port)
});
