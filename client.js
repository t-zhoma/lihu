// Variables
game = new Game();
game.gameList = [];
game.seatPos = [new Rect(30, 90, 60, 30), new Rect(90, 30, 30, 60),
                new Rect(30, 0, 60, 30), new Rect(0, 30, 30, 60)];
game.isChooseGame = false;
game.myName = '';
game.myRoom = -1;
game.mySeat = -1;
game.playersInRoom = 0;

game.tn = new Rect(550, 20, 100, 20);
game.ln = new Rect(40, 415, 100, 20);
game.rn = new Rect(940, 415, 100, 20);
game.bn = new Rect(550, 842, 100, 20);

game.hold = function () {
    // TODO
    renderer.drawBottomOutbox(new Array);
};

game.prompt = function () {
    this.choosePrompt(this.bb.cards, this.lastCards);
    renderer.drawBottomBox();
};

game.start = function () {
    if (game.playersInRoom < 4) {
        smoke.confirm('Not enough players, are you want to add robots and to start game?', function (e) {
            if (e) {
                socket.emit('StartGame', { room: game.myRoom, seat: game.mySeat });
            }
        });
    }
    else {
        socket.emit('StartGame', { room: game.myRoom, seat: game.mySeat });
    }
}

// update user cards
// caculate user score
game.put = function (putPlayerId, cards) {
    // update cards status

    if (cards.length == 0) {
        // hold
    } else {
        // put

        for (var idx in this.players) {
            var player = this.players[idx];
            if (putPlayerId == player.id) {
                console.log(' cards num ' + cards.length);

                var tmpCards = [];
                for (var idx01 in player.cards) {
                    var found = false;
                    for (var idx02 in cards) {
                        if (player.cards[idx01].isEqual(cards[idx02])) {
                            found = true; break;
                        }
                    }
                    if (found == false) {
                        tmpCards.push(player.cards[idx01]);
                    }
                }

                this.players[idx].cards = tmpCards;
                // simple
                this.players[idx].cardsNum -= cards.length;

                break;
            }
        }
        this.lastCards = cards;
        this.lastPut = new Put(putPlayerId, cards);
    }
}

game.roomId = 1;

renderer = new Renderer();
controller = new Controller();
//var input = new Input(game);
//sound = new SoundManager();


var clientId = Util.guidGenerator();


function preloadImg() {
    $('#loading').html('loading... please wait');
    game.buildImgSrcs();
    var imgPreloader = new ImagePreloader(game.imgSrcs, ImagePreloadCallback);
}

function ImagePreloadCallback(imgMap, nLoaded) {
    if (nLoaded != game.imgSrcs.length) {
        alert("Only " + nLoaded + " of " + game.imgSrcs.length + " images load successful!");
        return;
    }

    Source.imgMap = imgMap;
    $('#loading').hide();
    $('#btnStart').attr('disabled', true);
    $('#btnPut').attr('disabled', true);
    $('#btnHold').attr('disabled', true);
    $('#btnPrompt').attr('disabled', true);
}

window.onload = preloadImg;

document.addEventListener('DOMContentLoaded', function () {

    // Globals
    //socket = io.connect('http://o.smus.com:5050');
    socket = io.connect('http://localhost:8080');


    // start game, get cards from server
    /*
    var returnData = {
    code: 0/1,
    errorMsg: 'xxx', // if code = 1
    players: ,
    roomId: ,
    seatId: 
    };
    */
    socket.on('GameList', function (data) {
        game.gameList = data;
        renderer.drawGameList();
        game.isChooseGame = true;
    });

    socket.on('EnterRoom', function (data) {
        if (data.code != 0) {
            alert('fail to join the game' + data.errorMsg);
            return;
        }

        if (game.isChooseGame) {
            renderer.clear();
            renderer.drawPlayerInfo(game.myName, game.mySeat);
            game.playersInRoom++;
            for (var i = 0; i < data.players.length; i++) {
                renderer.drawPlayerInfo(data.players[i].name, data.players[i].seat);
                game.playersInRoom++;
            }

            game.isChooseGame = false;
            if (game.mySeat == 0) { $('#btnStart').attr('disabled', false); };
        }
        else {
            renderer.drawPlayerInfo(data.name, data.seat);
        }
    });

    // bradcast get user put cards and server result
    /*
    data = {
    curPut:
    players: players,
    nextPutPlayerId: ,
    }
    */
    socket.on('Put', function (data) {
        //##console.log('resv put');
        // update player cards and score status

        game.fillbox(data.players);
        if (data.curPut.cards.length != 0) {
            game.lastPut = data.curPut;
            game.lastCards = data.curPut.cards; // wait to delete.
        }

        renderer.drawPutCards(data.curPut.cards);
        game.curPutPlayerIdx = game.getIdxByPlayerId(data.nextPutPlayerId);
        $('#putter_name').html(game.players[game.curPutPlayerIdx].name);
        if (game.getCurrentPlayerIdx() != game.curPutPlayerIdx) {
            $('#btnPut').attr('disabled', true);
            $('#btnHold').attr('disabled', true);
        } else {
            $('#btnPut').attr('disabled', false);
            $('#btnHold').attr('disabled', false);
        }
    });

    // start game, get cards from server
    /*
    data = {
    players: players,
    nextPutPlayerId: ,
    curLevel: ,
    }
    */
    socket.on('RoundStart', function (data) {
        game.fillbox(data.players);
        game.buildCardOrder();
        game.curPutPlayerIdx = game.getIdxByPlayerId(data.nextPutPlayerId);
        game.sort(game.bb.cards);
        renderer.emptyPutCards();

        renderer.drawBox();
        $('#putter_name').html(game.players[game.curPutPlayerIdx].name);
        $('#cur_level').html(data.curLevel);
        if (game.getCurrentPlayerIdx() != game.curPutPlayerIdx) {
            $('#btnPut').attr('disabled', true);
            $('#btnHold').attr('disabled', true);
        } else {
            $('#btnPut').attr('disabled', false);
            $('#btnHold').attr('disabled', false);
        }

        // start game
        $('#home #waiting').hide();
        $('#home #game').show();
    });

    // round over
    /*
    data = {
    winnerId: 
    }
    */
    socket.on('RoundOver', function (data) {
        alert('round over! winner is ' + game.players[game.getIdxByPlayerId(data.winnerId)].name);
    });

    // leave room
    /*
    data = {
    
    }
    */
    socket.on('LeaveRoom', function (data) {
        //leavePlayer = curGame.players[ curGame.getIdxByPlayerId( data.playerId) ];
        //console.log('user leave the game : ' + leavePlayer.name );
        alert('somebody leaved the game ');
        game.over();

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
    socket.on('SelectSeat', function (data) {

    });

});
