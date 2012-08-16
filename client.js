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
    //##hideButton();
}

function hideButton() {
    $('#btnPut').hide();
    $('#btnHold').hide();
    $('#btnPrompt').hide();
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

        //        $('#putter_name').html(game.players[game.curPutPlayerIdx].name);
        //        $('#cur_level').html(data.curLevel);
        //        if (game.getCurrentPlayerIdx() != game.curPutPlayerIdx) {
        //            $('#btnPut').attr('disabled', true);
        //            $('#btnHold').attr('disabled', true);
        //        } else {
        //            $('#btnPut').attr('disabled', false);
        //            $('#btnHold').attr('disabled', false);
        //        }

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
