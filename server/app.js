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

var gamejs = new require('../game.js');
var Game = gamejs.Game;
var Player = gamejs.Player;
var game = new Game();
games = new Array;

var observerCount = 0;

// for test
// set robot
game.players.push(new Player('robot01', 'robot01'));
game.players.push(new Player('robot02', 'robot02'));
game.players.push(new Player('robot03', 'robot03'));
game.players[0].isRobot = true;
game.players[1].isRobot = true;
game.players[2].isRobot = true;

io.sockets.on('connection', function(socket) {
	console.log(socket.id);
	observerCount++;

	var curPlayer = false;
	var curGame = false;

	socket.on('data', function(data) {
		socket.emit('data', data);
	});

	// player join the game
	socket.on('join', function(data) {
		console.log('recv join request from ' + data);
		// if enough player, start the game
		roomId = data.roomId;
		//if ( games[roomId] == undefined ) {
		//	games[roomId] = new Game();
		//}
		//curGame= games[roomId];
		curGame = game;

		// already join the game
		for( var i in curGame.players ) {
			if ( data.playerId == curGame.players[i].id ) {
				socket.emit('join', {
					code: 0,
					msg: ''
				});
				return ;
			}
		}

		if ( curGame.players.length == 4 ) {
			socket.emit('join', {
				code: 1,
				errorMsg: 'room is full'
			});
			return ;
		}

		curPlayer = new Player(data.playerId, data.playerName);
		curPlayer.socketId = socket.id;
		curGame.players.push( curPlayer );
		// Broadcast that client has joined
		var returnData = {
			code: 0,
			players: curGame.players
		};
		socket.broadcast.emit('join', returnData);
		socket.emit('join', returnData);

		// could start
		if ( curGame.players.length == 4 ) {
			console.log('game start');
			// build deck and shuffe
			curGame.start();
			// send poke
			for(var idx in curGame.players) {
				var player = curGame.players[ idx ];
				if ( player.isRobot == true ) continue ;
				var players = curGame.players;
				for( var idx2 in players ) {
					// empty cards
					if ( idx2 != idx ) players.cards = [];
				}
				io.sockets.socket( player.socketId ).emit('game start' ,{
					players: players,
					playerId: player.id,
					nextPutPlayerId: curGame.players[ curGame.curPutPlayerIdx ].id

				});
			}
			
		}
	});

	// quit game
	socket.on('quit', function(data) {	
		console.log('quit game');
	});

	// user put cards
	socket.on('put', function(data) {
		console.log('recv client put');

		// TODO verify put cards
		if ( curGame.canPut(data.cards) == false ) {
			// socket.emit error
			return false;
		}
		// update cards & scores
		curGame.put(data.playerId, data.cards);

		if ( curGame.isGameOver() == true ) {
			// game over , we have a winner
			for( var idx in curGame.players ) {
				var player = curGame.players[ idx ];
				if ( player.isRobot == true ) continue;
				io.sockets.socket( player.socketId ).emit('game over', {
					winnerId: curGame.getWinnerId(),
					players: curGame.players,
					putCards: data.cards
				});
			}

		} else {
			var nextPutPlayer = curGame.getNextPutPlayer();
			console.log( curGame.curPutPlayerIdx );

			
			// send message to user
			for( var idx in curGame.players ) {
				var player = curGame.players[ idx ];
				if ( player.isRobot == true ) continue;
				var players = curGame.players;
				for( var idx2 in players ) {
					// empty cards
					if ( idx2 != idx ) players.cards = [];
				}
				io.sockets.socket( player.socketId ).emit('put', {
					players: players,
					playerId: player.id,
					nextPutPlayerId: nextPutPlayer.id,
					putCards: data.cards

				});
			}


			while ( nextPutPlayer.isRobot == true ) {
				// is robot. 
				// current stratogy is just hold.

				nextPutPlayer = curGame.getNextPutPlayer();
				// send message to user
				for( var idx in curGame.players ) {
					var player = curGame.players[ idx ];
					if ( player.isRobot == true ) continue;
					var players = curGame.players;
					for( var idx2 in players ) {
						// empty cards
						if ( idx2 != idx ) players.cards = [];
					}
					io.sockets.socket( player.socketId ).emit('put', {
						players: players,
						playerId: player.id,
						nextPutPlayerId: nextPutPlayer.id,
						putCards: []

					});
				}

				
			}

		}

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

/*

	// Periodically emit time sync commands
	var timeSyncTimer = setInterval(function() {
		socket.emit('time', {
		observerCount: observerCount
	    	});
		console.log('sync send');
	}, 2000);
*/

});


console.log("You can start the game by going to 127.0.0.1:8080, if you want to join the game with another pc go to <pc name or ip of server pc>:8080");
