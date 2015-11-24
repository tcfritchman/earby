var express = require('express');
var app = express();
var port = process.argv[2];

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.htm');
});

var server = app.listen(port, function() {
    console.log('Server listening on port ' + port)
});
