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
}

window.onload = preloadImg;

function allowPut(isAllow) {
    $('#btnHold').attr('disabled', !isAllow);
    $('#btnPrompt').attr('disabled', !isAllow);
    $('#btnPut').attr('disabled', !isAllow);
}

document.addEventListener('DOMContentLoaded', function () {

    // Globals
    //socket = io.connect('http://o.smus.com:5050');
    socket = io.connect('http://localhost:8080');


    // Update game list
    socket.on('GameList', function (data) {
        game.gameList = data;
        renderer.drawGameList();
        game.stage = game.StageType.CHOOSE_GAME;
    });

    socket.on('EnterRoom', function (data) {
        if (data.code != 0) {
            alert('fail to join the game' + data.errorMsg);
            return;
        }

        if (game.stage == game.StageType.CHOOSE_GAME) {
            $('#home #waiting').show();
            $('#home #game').hide();

            renderer.updateWaitingPage(data);

            game.stage = game.StageType.WAITING;
            if (game.mySeat == 0) {
                $('#btnStart').show();
            }
            else {
                $('#btnStart').hide();
            }
        }
        else if (game.stage == game.StageType.WAITING) {
            renderer.updateWaitingPage(data);
        }
        else if (game.stage == game.StageType.PLAYING) {
            // TODO
        }
    });

    // start game, get cards from server
    socket.on('RoundStart', function (data) {
        game.players = data.players;
        game.fillbox(data.players);

        game.curPutterSeat = data.curPutterSeat;
        game.level_0_2 = data.level_0_2;
        game.level_1_3 = data.level_1_3;
        game.isLevel_0_2 = data.isLevel_0_2;

        game.buildCardOrder();
        game.sort(game.bb.cards);
        renderer.clear();
        renderer.drawBox();

        $('#home #waiting').hide();
        $('#home #game').show();
        allowPut(false);

        // li hu ?
        if (game.getCurrentLevel() != 11) { // 'a'
            smoke.confirm('Do you want to li hu?', function (e) { socket.emit('lihu', { room: game.myRoom, seat: game.mySeat, isLihu: e }); });
        }

    });

    // lihu players
    socket.on('lihu', function (data) {
        var players = data.lihuPlayersName;
        var tmp = '';
        for (var i = 0; i < players.length; i++) {
            tmp += players[i] + ' ';
        }
        if (tmp == '') { tmp = 'No one ' }
        smoke.signal(tmp + 'lihu!');
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

    socket.on('NewPut', function (data) {
        allowPut(data.curPutterSeat == game.mySeat);
        game.lastPutterSeat = data.lastPutterSeat;
        game.lastPutCards = data.lastPutCards;

        if (data.curPutterSeat == data.lastPutterSeat) { game.lastPutCards = []; }
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
    name:
    room:
    seat:
    }
    */
    socket.on('LeaveRoom', function (data) {
        smoke.signal(data.name + ' leaved the game !');
        renderer.updateWaitingPage(data);
        //##game.over();
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
