var express = require('express');
var app = express.createServer();
var socket = require('socket.io');
app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
	res.send('index');
})

var server = app.listen(3000);
var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
	console.log("connnect");
	socket.on('disconnect', function (socket) {
		console.log("disconnect");
	});
});