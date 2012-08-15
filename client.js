var ClientGame = function() { }

ClientGame.prototype = new Game();
//ClientGame.prototype.gameList = [];

//##game = new Game();
game = new ClientGame();
game.gameList = [];
game.seatPos = [new Rect(30, 90, 60, 30), new Rect(90, 30, 30, 60),
                new Rect(30, 0, 60, 30), new Rect(0, 30, 30, 60)];
game.isChooseGame = false;
game.myName = '';
game.myRoom = -1;
game.mySeat = -1;


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
//    $('#home').hide();
//    $('#room_block').show();

//    $('#btnPut').attr('disabled', true);
//    $('#butHold').attr('disabled', true);
    //    $('#butPrompt').attr('disabled', true);
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

        //##console.log('resv server join' + data);

        if (data.code != 0) {
            alert('fail to join the game' + data.errorMsg);
            return;
        }

        $('#room_block').fadeOut('slow');
        $('#home').fadeIn('slow');

        // save user
        game.players = data.players;

        $('#home #game').hide();
        $('#home #waiting').show();
        var userHtml = '';
        for (var idx in data.players) {
            userHtml += '<li> seat: ' + data.players[idx].seatId + '  name: ' + ( data.players[idx].name == false ? 'Empty' : data.players[idx].name )+ '</li>';
        }
        $('#home #waiting #player_list').html(userHtml);
        $('#home #waiting #room_id').html(data.roomId);

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
