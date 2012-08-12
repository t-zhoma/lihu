var http = require('http')
	, fs = require('fs');

var pipeFile = function(path, res) {
	res.writeHead('200');
	fs.createReadStream(path).pipe(res);
}
var server = http.createServer(function(req, res) {
	if (req.url.length == 1)
		req.url = "/index.html";
	req.url = "." + req.url;
	fs.exists(req.url, function(exists) {
		if (!exists) {
			console.log("cant find the following url", req.url);
			res.writeHead(404);
			res.end();
			return;
		}
		res.writeHead(200);
		var file = fs.createReadStream(req.url);
		file.pipe(res);
	});
}).listen(8080);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
	socket.on('data', function(data) {
		socket.emit('data', data);
	});

	// player join the game
	socket.on('join', function(data) {
		console.log('recv join request from ' + data.name);
		// if enough player, start the game
	});

	// quit game
	socket.on('quit', function(data) {	
		console.log('quit game');
	});

	// user put cards
	socket.on('put', function(data) {

	});

	socket.on('disconnect', function(data) {
	    console.log('recv disconnect', data);
	    //observerCount--;
	    //game.leave(playerId);
	    // If this was a player, it just left
	    //if (playerId) {
	    //  socket.broadcast.emit('leave', {name: playerId, timeStamp: new Date()});
	    //}
	});
});

console.log("You can start the game by going to 127.0.0.1:8080, if you want to join the game with another pc go to <pc name or ip of server pc>:8080");
