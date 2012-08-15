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


var gamejs = new require('../game.js');
var Game = gamejs.Game;
var Put = gamejs.Put;
var Player = gamejs.Player;
var games = [];

var observerCount = 0;

// for test
// set robot

var curPlayer = false;
var curRoomId = false;

// init games , five games init
games.push(new Game());
games.push(new Game());
games.push(new Game());
games.push(new Game());
games.push(new Game());
games.push(new Game());


var io = require('socket.io').listen(server);
//io.set('log level', 1);

io.sockets.on('connection', function (socket) {
    console.log(socket.id);
    observerCount++;
    //socket.emit('enter room', {
    //	players: curGame.players
    //});

    // player enter the room
    /* recieve
	data = {
		roomId : ,
		seatId : ,
		playerId : ,
		playerName : ,
		robotCnt : , 
	}
    */
    socket.on('EnterRoom', function (data) {
        console.log('recv join request from ' + data.playerId + ' ' + data.playerName + ' ' + data.seatId);
        // if enough player, start the game

        // get room id
        if (isNaN(data.roomId)) curRoomId = 0;
        else curRoomId = parseInt(data.roomId);

        // get seat id
        var seatId = data.seatId;
        if (isNaN(seatId)) seatId = 0;
        else seatId = parseInt(seatId);

        console.log('room id ' + curRoomId);
        //if ( games[roomId] == undefined ) {
        //	games[roomId] = new Game();
        //}
        //curGame= games[roomId];	
        if (curRoomId >= games.length) {
            // invalid games
            socket.emit('enter room', {
                code: 1,
                errorMsg: 'invalid room, please rejoin'
            });
            return;
        }

        if (games[curRoomId] === false || games[curRoomId].isRoomEmpty() == true ) {
            console.log('new game');
            games[curRoomId] = new Game();
            var robotCnt = 0;
            // create robot
            if (!isNaN(data.robotCnt)) {
                robotCnt = parseInt(data.robotCnt);
                if (robotCnt > 3) robotCnt = 3;
                for (var idx = 1; idx <= robotCnt; idx++) {
                    robot = new Player('robot0' + idx, 'robot0' + idx);
                    robot.isRobot = true;
                    games[curRoomId].addPlayer(robot);
                }
            }
        } else {
            console.log('player num ' + games[curRoomId].players.length);
        }

        // already join the game
        if ( games[curRoomId].inRoom( data.playerId ) == true  ) {
            socket.emit('EnterRoom', {
                    code: 0,
                    msg: ''
                });
                return;
        }

        // check is there any seat for the player
        if (games[curRoomId].isRoomFull() == true ) {
            socket.emit('EnterRoom', {
                code: 1,
                errorMsg: 'room is full'
            });
            return;
        }

        curPlayer = new Player(data.playerId, data.playerName);
        curPlayer.socketId = socket.id;
        curPlayer.seatId = data.seatId;

        console.log(curPlayer.id + ' ' + curPlayer.name) ;

        // have seat
        if ( games[curRoomId].addPlayer(curPlayer) === false) {
            return ;
        }

        // Broadcast that client has joined
        var returnData = {
            code: 0,
            roomId: curRoomId
        };

        roomBroadCast('EnterRoom', returnData);
       	/*
        for (var idx in games[curRoomId].players) {
            var player = games[curRoomId].players[idx];
            if (player.isRobot == true) continue;
            io.sockets.socket(player.socketId).emit('EnterRoom', returnData);
        }
        // socket.emit('join', returnData);
		*/

        // could start
        if (games[curRoomId].ready()) {
            roundStart();
        }
    });

    // quit game
    /*
     player leave room
	data = {
		playerId : ,
		roomId : ,
	}
    */
    socket.on('LeaveRoom', function (data) {
        console.log('quit game');
        leaveRoom(data);
    });

    // user put cards
    /*
	data = {
		put: curPut,
	}
    */
    socket.on('Put', function (data) {
        console.log('recv client put');

        var curPut = data.put;

        // TODO verify put cards
        if (games[curRoomId].canPut(curPut.cards) == false) {
            // socket.emit error
            return false;
        }


        // update cards & scores
        games[curRoomId].put(curPut.playerId, curPut.cards);

        var nextPutPlayer = games[curRoomId].getNextPutPlayer();
        console.log(games[curRoomId].curPutPlayerIdx);


        // send message to user
        var putData = {
        	curPut: curPut,
            nextPutPlayerId: nextPutPlayer.id,

        }
        roomBroadCast('Put', putData);
        

        // game over , we have a winner
        if (games[curRoomId].isGameOver() == true) {
            
            games[ curRoomId ].roundOver();
            roomBroadCast('RoundOver', {
                    winnerId: games[curRoomId].getWinnerId()
                });


            if (games[curRoomId].ready()) {
                roundStart();
            }
        } else {
            while (nextPutPlayer.isRobot === true) {
                // is robot. 
                // current stratogy is just hold.
                games[curRoomId].choosePrompt(nextPutPlayer.cards, games[curRoomId].lastCards);
                var selectedCards = games[curRoomId].getSelectedCards(nextPutPlayer.cards);
                games[curRoomId].put(nextPutPlayer.id, selectedCards);

                var robotPut = new Put(nextPutPlayer.id, selectedCards);

                nextPutPlayer = games[curRoomId].getNextPutPlayer();
                // send message to user
                roomBroadCast('Put', {
                        nextPutPlayerId: nextPutPlayer.id,
                        curPut: robotPut

                });

            }

        }



    });

    socket.on('disconnect', function (data) {
        console.log('recv disconnect', data);
        leaveRoom(false);
    });

    // select seat
    // TODO
    /*
    data = {
        seatId : ,
        roomId : ,
        playerId : ,
    }
    */
    socket.on('SelectSeat', function(data) {
        
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
    function roundStart() {
        console.log('game start');
        // build deck and shuffe
        games[curRoomId].start();
        // send poke
        for (var idx in games[curRoomId].players) {
            var player = games[curRoomId].players[idx];
            if (player.isRobot == true) continue;
            var players = games[curRoomId].players;
            for (var idx2 in players) {
                // empty cards
                if (idx2 != idx) players.cards = [];
            }
            io.sockets.socket(player.socketId).emit('RoundStart', {
                players: players,
                nextPutPlayerId: games[curRoomId].lastWinnerId,
                curLevel: games[curRoomId].curLevel
            });
        }
    }
    function leaveRoom(data) {
        //if ( data != false ) {
        //	leavePlayer = games[ curRoomId ].players[ games[ curRoomId ].getIdxByPlayerId( data.playerId) ];
        //	console.log('user leave game : ' + leavePlayer.name );
        //}
        // send message to user

        if (curRoomId !== false && games[curRoomId].isRoomEmpty() !== false && data.playerId !== undefined ) {
        	var inRoom = false;
            for (var idx in games[curRoomId].players) {
                var player = games[curRoomId].players[idx];
                if ( player.id == data.playerId ) {
                	inRoom = true ;
                	break;
                }
            }

            // have not in this room, do nothing
            if ( inRoom == false ) return ;
            
            roomBroadCast('LeaveRoom', data);
            games[curRoomId].leaveRoom();
            console.log('leave room num : ' + games[curRoomId].players.length);
        }
    }

    function roomBroadCast(action, data) {
    	console.log('broadcast in room  ' + curRoomId + ' ' + action + ' ' + games[curRoomId].players.length);

    	if ( curRoomId === false || games[curRoomId].isRoomEmpty == false) return false;

        for (var idx in games[curRoomId].players) {
	        var player = games[curRoomId].players[idx];
	        console.log(player.name + ' ');
	        if (player.isRobot == true || player.id === false ) continue;
	        var players = games[curRoomId].players;
	        for (var idx2 in players) {
	            // empty cards
	             if (idx2 != idx) players.cards = [];
	        }
	        var tmpData = data;
	        tmpData.players = players;
            io.sockets.socket(player.socketId).emit(action, tmpData);
        }
    }

});


console.log("You can start the game by going to 127.0.0.1:8080, if you want to join the game with another pc go to <pc name or ip of server pc>:8080");
