var express = require('express');
var app = express();
var port = process.argv[2];

app.use('/', express.static(__dirname + '/build'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/build/index.htm');
});

var server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
