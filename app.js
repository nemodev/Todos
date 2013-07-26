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

//var todos = [{id:1,content:"HTML5 공부",done=false, isAlive=true}];
var lookup = {};
lookup[1] = {id:1,content:"HTML5 Study", isDone:false, isAlive:true};

var nextId = 2;

io.sockets.on('connection', function (socket) {
	console.log('New client is connected');

	socket.on('requestAll', function() {
		socket.emit('giveAll', lookup);
	});

	socket.on('disconnect', function (socket) {
		console.log("disconnect");
	});

	socket.on('todoAdding', function (todo){
		console.log(todo.id + " is being added.");

		todo.id = nextId;
		lookup[todo.id] = todo;
		console.log(todo);

		io.sockets.emit('todoAdded', todo);

		nextId++;
	});

	socket.on('todoRemoving', function(removingTodoId){
		console.log(removingTodoId + " is being removed.");

		var id = removingTodoId;
		var todoRemoving = lookup[id];
		todoRemoving.isAlive = false;

		console.log(todoRemoving);

		io.sockets.emit('todoRemoved', todoRemoving);
	});

	socket.on('todoDoneChanging', function(data){
		var id = data.id;
		var isDone = data.isDone;

		console.log(id + ' is ' + (isDone? 'done.':'not done.'));
		
		var todo = lookup[id];
		todo.isDone = isDone;

		console.log(todo);

		io.sockets.emit('todoDoneChanged', todo);
	});
});