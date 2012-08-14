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
var rooms = [];

var observerCount = 0;

// for test
// set robot

var curPlayer = false;
var curRoomId = false;

// init rooms , five rooms init
rooms.push(new Game());
rooms.push(new Game());
rooms.push(new Game());
rooms.push(new Game());
rooms.push(new Game());

io.sockets.on('connection', function(socket) {
	console.log(socket.id);
	observerCount++;
	//socket.emit('enter room', {
	//	players: curGame.players
	//});

	socket.on('data', function(data) {
		socket.emit('data', data);
	});

	// player join the game
	socket.on('join', function(data) {
		console.log('recv join request from ' + data);
		// if enough player, start the game
		
		if ( isNaN( data.roomId ) ) curRoomId = 0;
		else curRoomId = parseInt(data.roomId);

		console.log('room id ' + curRoomId);
		//if ( games[roomId] == undefined ) {
		//	games[roomId] = new Game();
		//}
		//curGame= games[roomId];	
		if ( curRoomId >= rooms.length ) {
			// invalid rooms
			socket.emit('join', {
				code: 1,
				errorMsg: 'invalid room, please rejoin'
			});
			return ;
		}

		if ( rooms[ curRoomId ] == false || rooms[ curRoomId ].players.length == 0 ) {
			console.log('new game');
			rooms[ curRoomId ] = new Game();
			var robotCnt = 0;
			// create robot
			if ( !isNaN(data.robotCnt) ) {
				robotCnt = parseInt( data.robotCnt );
				if ( robotCnt > 3) robotCnt = 3;
				for(var idx = 1; idx <= robotCnt ; idx++ ) {
					robot = new Player('robot0' + idx , 'robot0' + idx);
					robot.isRobot = true;
					rooms[ curRoomId ].players.push( robot );
				}
			}
		} else {
			console.log('player num ' + rooms[ curRoomId ].players.length );
		}

		// already join the game
		for( var i in rooms[ curRoomId ].players ) {
			if ( data.playerId == rooms[ curRoomId ].players[i].id ) {
				socket.emit('join', {
					code: 0,
					msg: ''
				});
				return ;
			}
		}

		if ( rooms[ curRoomId ].players.length == 4 ) {
			socket.emit('join', {
				code: 1,
				errorMsg: 'room is full'
			});
			return ;
		}

		curPlayer = new Player(data.playerId, data.playerName);
		curPlayer.socketId = socket.id;
		rooms[ curRoomId ].players.push( curPlayer );
		// Broadcast that client has joined
		var returnData = {
			code: 0,
			players: rooms[ curRoomId ].players,
			roomId: curRoomId
		};
		for ( var idx in rooms[ curRoomId ].players ) {
			var player = rooms[ curRoomId ].players[ idx ];
			if ( player.isRobot == true ) continue;
			io.sockets.socket( player.socketId ).emit('join', returnData);
		}
		socket.emit('join', returnData);

		// could start
		if ( rooms[ curRoomId ].ready() ) {
			gameStart();
			
		}
	});

	// quit game
	socket.on('leave', function(data) {	
		console.log('quit game');
		gameOver(data);	
	});

	// user put cards
	socket.on('put', function(data) {
		console.log('recv client put');

		// TODO verify put cards
		if ( rooms[ curRoomId ].canPut(data.cards) == false ) {
			// socket.emit error
			return false;
		}
		// update cards & scores
		rooms[ curRoomId ].put(data.playerId, data.cards);

			var nextPutPlayer = rooms[ curRoomId ].getNextPutPlayer();
			console.log( rooms[ curRoomId ].curPutPlayerIdx );

			
			// send message to user
			for( var idx in rooms[ curRoomId ].players ) {
				var player = rooms[ curRoomId ].players[ idx ];
				if ( player.isRobot == true ) continue;
				var players = rooms[ curRoomId ].players;
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

			if ( rooms[ curRoomId ].isGameOver() == true ) {
				// game over , we have a winner
				for( var idx in rooms[ curRoomId ].players ) {
					var player = rooms[ curRoomId ].players[ idx ];
					if ( player.isRobot == true ) continue;
					io.sockets.socket( player.socketId ).emit('game over', {
						winnerId: rooms[ curRoomId ].getWinnerId(),
						players: rooms[ curRoomId ].players,
						putCards: data.cards
					});
				}

				if ( rooms[ curRoomId ].ready() ) {
					gameStart();
				}



			} else {
				while ( nextPutPlayer.isRobot == true ) {
					// is robot. 
					// current stratogy is just hold.

					nextPutPlayer = rooms[ curRoomId ].getNextPutPlayer();
					// send message to user
					for( var idx in rooms[ curRoomId ].players ) {
						var player = rooms[ curRoomId ].players[ idx ];
						if ( player.isRobot == true ) continue;
						var players = rooms[ curRoomId ].players;
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
	    gameOver(false);
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
	function gameStart() {
		console.log('game start');
			// build deck and shuffe
			rooms[ curRoomId ].start();
			// send poke
			for(var idx in rooms[ curRoomId ].players) {
				var player = rooms[ curRoomId ].players[ idx ];
				if ( player.isRobot == true ) continue ;
				var players = rooms[ curRoomId ].players;
				for( var idx2 in players ) {
					// empty cards
					if ( idx2 != idx ) players.cards = [];
				}
				io.sockets.socket( player.socketId ).emit('game start' ,{
					players: players,
					playerId: player.id,
					nextPutPlayerId: rooms[ curRoomId ].players[ rooms[ curRoomId ].curPutPlayerIdx ].id

				});
			}
	}
	function gameOver(data) {
		//if ( data != false ) {
		//	leavePlayer = rooms[ curRoomId ].players[ rooms[ curRoomId ].getIdxByPlayerId( data.playerId) ];
		//	console.log('user leave game : ' + leavePlayer.name );
		//}
		// send message to user

		if ( curRoomId == false || rooms[ curRoomId].players.length != 0 ) {
			for(var idx in rooms[ curRoomId ].players) {
				var player = rooms[ curRoomId ].players[ idx ];
				if ( player.isRobot == true ) continue ;
				io.sockets.socket( player.socketId ).emit('leave', data);
			} 
			rooms[ curRoomId ].over();
		}
	}

});


console.log("You can start the game by going to 127.0.0.1:8080, if you want to join the game with another pc go to <pc name or ip of server pc>:8080");
