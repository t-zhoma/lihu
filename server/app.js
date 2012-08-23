var http = require('http')
	, fs = require('fs');
var path = require('path');

var pipeFile = function(path, res) {
	res.writeHead('200');
	fs.createReadStream(path).pipe(res);
}

var server = http.createServer(function(request, response) {

    var filePath = '.' + request.url;
    if (request.url.length == 1)
        filePath = './home.html';
         
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png' : 
            contentType = 'image/png';
            break;
    }

    path.exists(filePath, function(exists) {
        
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

}).listen(8080);


var utiljs = new require('../utility.js');
var Util = utiljs.Util;
var servergamejs = new require('./serverGame.js');
var Game = servergamejs.Game;
var Player = servergamejs.Player;
var GAME_COUNT = 10;
var games = [];
var socketIds = [];

// init games , five games init
for(var i = 0; i < GAME_COUNT; i++){ 
    var temp = new Game();
    temp.initPlayers();
    games.push(temp); 
}

var io = require('socket.io').listen(server);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
    console.log(socket.id);
    socketIds.push(socket.id);

    socket.emit('Connected', {});

    // GameList request
    socket.on('GameList', function (data) {
        var gameList = [];
        for (var i = 0; i < GAME_COUNT; i++) {
            gameList[i] = new Array;
            for (var j = 0; j < 4; j++) {
                if (games[i].players[j] == null) {
                    gameList[i][j] = null;
                    continue;
                }

                gameList[i][j] = { name: games[i].players[j].name };
            }
        }

        socket.emit('GameList', gameList);
    });

    // Enter Room
    socket.on('EnterRoom', function (data) {
        if (isNaN(data.room) || isNaN(data.seat) || data.playerName == '' ||
           data.room >= GAME_COUNT || data.seat >= 4 ||
           games[data.room].players[data.seat] != null) {
            console.log(games[data.room].players[data.seat] );
            console.log('invalid parameter in join request.');
            socket.emit('EnterRoom', {
                code: 1,
                errorMsg: 'Join room fail, please rejoin!'
            });
            return;
        }

        console.log('join request from ' + data.playerName + ', room: ' + data.room + ',seat: ' + data.seat);

        var playerList = new Array;
        var player = new Player(data.playerName);
        player.socketId = socket.id;
        games[data.room].players[data.seat] = player;

        roomBroadCast(data.room, 'EnterRoom', { room: data.room, code: 0 }, true);
        gameListUpdate();
    });

    socket.on('StartGame', function (data) {
        if (data.room >= GAME_COUNT || data.seat > 3) {
            console.log('Valid parameter in StartGame request.');
            return;
        }

        games[data.room].isStart = true;

        // robot needed?
        for (var i = 0; i < 4; i++) {
            if (games[data.room].players[i] == null) {
                var player = new Player('Robot' + i);
                player.isRobot = true;
                player.seatId = i;
                games[data.room].players[i] = player;
            }
        }

        // new round
        roundStart(data.room);
    });

    // quit game
    /*
    player leave room
    data = {
    room : ,
    seat : ,
    name :
    }
    */
    socket.on('LeaveRoom', function (data) {
        console.log(data.name + ' Leave room ' + data.room + ', seat ' + data.seat);
        leaveRoom(data);
    });

    //user put cards
    /*data = {
    room : ,
    seat : ,
    putCards : ,
    remainCards :
    }
    */
    socket.on('Put', function (data) {
        console.log('recv client put');

        var game = games[data.room];
        var putter = game.players[data.seat];

        if (data.putCards.length != 0) {
            game.lastPutterSeat = data.seat;
            game.lastPutCards = data.putCards;
            putter.cards = data.remainCards;
            putter.cardsNum = data.remainCards.length;
        }

        roomBroadCast(data.room, 'Put', { putterSeat: data.seat, putCards: data.putCards }, true);

        if (putter.cards.length == 0) {
            if (addFinishPlayer(data.room, game.curPutterSeat)) { return; }
        }

        game.curPutterSeat = game.nextSeat(game.curPutterSeat);
        putCards(data.room);
    });

    socket.on('disconnect', function (data) {
        console.log('recv disconnect', data);
        // delete from socketIds
        for (var i = 0; i < socketIds.length; i++) {
            if (socketIds[i] == socket.id) { socketIds.splice(i, 1); }
        }

        for (var i = 0; i < GAME_COUNT; i++) {
            for (var j = 0; j < 4; j++) {
                var player = games[i].players[j];
                if (player == null || player.isRobot) { continue; }
                if (player.socketId == socket.id) {
                    leaveRoom({ name: player.name, room: i, seat: j });
                }
            }
        }
    });

    /*
    data {
        name: 
        room:
        msg:
    }
    */
    socket.on('RoomChat', function(data) {
        if ( isNaN(data.room) || data.room >= GAME_COUNT || data.msg == '' ||
        data.name == '' ) {
            // invalid data
            return;
        }

        roomBroadCast(data.room, 'RoomChat', { 
            name: data.name,
            room: data.room,
            msg: data.msg 
            }, false);
            

    });

    socket.on('lihu', function (data) {
        var game = games[data.room];
        game.lihuResponsNum++;
        game.players[data.seat].isLihu = data.isLihu;

        if (game.lihuResponsNum == 4) {
            game.calcLihuType();
            roomBroadCast(data.room, 'lihu', { lihuPlayersName: game.getLihuPlayersName() }, false);
            putCards(data.room);
        }
    });

    function roundStart(room) {
        console.log('new round start in room ' + room);

        // init game state
        games[room].finishPlayers = [];
        games[room].lastPutCards = [];
        games[room].lihuResponsNum = 0;

        // build deck and shuffle
        games[room].start();

        // send cards
        roomBroadCast(room, 'RoundStart', { curPutterSeat: games[room].curPutterSeat,
            level_0_2: games[room].level_0_2,
            level_1_3: games[room].level_1_3,
            isLevel_0_2: games[room].isLevel_0_2
        }, true);

        // li hu ?
        if (games[room].getCurrentLevel() != 11) { // 'a'
            for (var i = 0; i < 4; i++) {
                if (games[room].players[i].isRobot) {
                    games[room].lihuResponsNum++;
                    games[room].players[i].isLihu = false;
                }
            }
        }
        else {
            games[room].lihuType = 0;
            games[room].needPut = [true, true, true, true];
            games[room].needPutCount = 4;
            games[room].curPutterSeat = games[room].firstPutterSeat;
            putCards(room);
        }
    }

    // return true means game over or round over
    function putCards(room) {
        var game = games[room];
        robotPut(room);
        while (!game.needPut[game.curPutterSeat]) {
            game.curPutterSeat = game.nextSeat(game.curPutterSeat);
        }

        if (game.players[game.curPutterSeat].cards.length == 0) {
            game.needPut[game.curPutterSeat] = false;
            if (game.lastPutterSeat == game.curPutterSeat) { game.lastPutCards = []; }
            game.curPutterSeat = game.nextSeat(game.curPutterSeat);
            if (robotPut(room)) { return true; }
        }

        roomBroadCast(room, 'NewPut', { curPutterSeat: game.curPutterSeat,
            lastPutterSeat: game.lastPutterSeat,
            lastPutCards: game.lastPutCards
        }, false);

        return false;
    }

    function robotPut(room) { // return true means game over or round over
        var game = games[room];

        while (game.players[game.curPutterSeat].isRobot || !game.needPut[game.curPutterSeat]) {
            if (!game.needPut[game.curPutterSeat]) {
                game.curPutterSeat = game.nextSeat(game.curPutterSeat);
                continue;
            }
            Util.pause(500); // Robot thinking !
            if (game.lastPutterSeat == game.curPutterSeat) { game.lastPutCards = []; }

            var cards = game.players[game.curPutterSeat].cards;

            if (cards.length == 0) {
                game.needPut[game.curPutterSeat] = false;
                if (game.lastPutterSeat == game.curPutterSeat) { game.lastPutCards = []; }

                game.curPutterSeat = game.nextSeat(game.curPutterSeat);
                continue;
            }

            game.choosePrompt(cards, game.lastPutCards);
            var putCards = game.getSelectedCards(cards);

            if (putCards.length != 0) {
                game.removeSelectedCards(cards);
                game.players[game.curPutterSeat].cardsNum = cards.length;
                game.lastPutterSeat = game.curPutterSeat;
                game.lastPutCards = putCards;
            }

            roomBroadCast(room, 'Put', { putterSeat: game.curPutterSeat, putCards: putCards }, true);

            if (cards.length == 0) {
                if (addFinishPlayer(room, game.curPutterSeat)) { return true; }
            }

            game.curPutterSeat = game.nextSeat(game.curPutterSeat);
        }

        return false;
    }

    // return true means game over or round over
    function addFinishPlayer(room, seat) {
        var ret = false;
        game = games[room];
        var data = game.addFinishPlayer(seat);

        if (data.isGameOver) {
            ret = true;
            roomBroadCast(room, 'GameOver', { is0_2Win: data.is0_2Win }, false);
            resetGame(room);
        }
        else if (data.isRoundOver) {
            ret = true;
            roundStart(room);
        }
        else {
            roomBroadCast(room, 'PlayerFinish', { seat: seat, rank: data.rank }, false);
        }

        return ret;
    }

    function leaveRoom(data) {
        games[data.room].players[data.seat] = null;

        if (games[data.room].isStart) {
            roomBroadCast(data.room, 'GameAbort', { msg: data.name + ' leave!' }, true);
            resetGame(data.room);
        }
        else {
            roomBroadCast(data.room, 'LeaveRoom', data, true);
        }

        gameListUpdate();
    }

    function resetGame(room) {
        var temp = new Game();
        temp.initPlayers();
        games[room] = temp;
    }

    function roomBroadCast(room, action, data, isSendPlayerInfo) {
        console.log('broadcast in room  ' + room + ' ' + action);

        if (room >= GAME_COUNT) { return false; }

        for (var i = 0; i < 4; i++) {
            var player = games[room].players[i];
            if (player == null || player.isRobot == true) { continue; }

            var tmpData = data;
            var players = [];
            if (isSendPlayerInfo) {
                players = games[room].getPlayers();
                for (var j = 0; j < 4; j++) {
                    if (j == i || players[j] == null) { continue; }
                    players[j].cards = []; // empty cards
                }
            }

            tmpData.players = players;
            io.sockets.socket(player.socketId).emit(action, tmpData);
        }
    }

    function gameListUpdate() {
        console.log('gameListUpdate');
        allBroadCast('GameListUpdate', {});
    }

    function allBroadCast(action, data) {
        for (var i = 0; i < socketIds.length; i++) {
            io.sockets.socket(socketIds[i]).emit(action, data);
        }
    }

});

console.log("You can start the game by going to 127.0.0.1:8080, if you want to join the game with another pc go to <pc name or ip of server pc>:8080");
