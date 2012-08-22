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
    //socket = io.connect('http://localhost:8080');
    socket = io.connect('http://10.172.4.74:8080');

    socket.on('Connected', function (data) {
        switch (game.stage) {
            case game.StageType.CHOOSE_GAME:
                socket.emit('GameList', {});
                break;
            case game.StageType.WAITING:
                // Do nothing
                break;
            case game.StageType.PLAYING:
                // Do nothing
                break;
        }
    });

    // Update game list
    socket.on('GameList', function (data) {
        game.gameList = data;
        renderer.clear();
        renderer.drawGameList();
        game.stage = game.StageType.CHOOSE_GAME;

        $('#home #waiting').hide();
        $('#home #game').show();
    });

    // Self or other player enter room
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
            game.mySeat == 0 ? $('#btnStart').show() : $('#btnStart').hide();
        }
        else if (game.stage == game.StageType.WAITING) {
            renderer.updateWaitingPage(data);
        }
        else if (game.stage == game.StageType.PLAYING) {
            // Now do nothing
        }
    });

    // start game, get cards from server
    socket.on('RoundStart', function (data) {
        game.stage = game.StageType.PLAYING;
        game.players = data.players;
        game.fillbox(data.players);

        game.curPutterSeat = data.curPutterSeat;
        game.level_0_2 = data.level_0_2;
        game.level_1_3 = data.level_1_3;
        game.isLevel_0_2 = data.isLevel_0_2;
        $('#home #game #cur_level').html(data.isLevel_0_2 ? game.level[data.level_0_2] : game.level[data.level_1_3]);
        var yourLevel = data.isLevel_0_2 ? (game.mySeat % 2 == 0) : (game.mySeat % 2 == 1);
        $('#home #game #your_level').html(yourLevel ? 'yes' : 'no');

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
        $('#home #game #lihu_player').html(tmp);
    });

    // bradcast get user put cards and server result
    socket.on('Put', function (data) {
        game.fillbox(data.players);
        renderer.drawPutCards(data.putterSeat, data.putCards);
        renderer.drawBottomBox();
    });

    socket.on('NewPut', function (data) {
        allowPut(data.curPutterSeat == game.mySeat);
        game.lastPutterSeat = data.lastPutterSeat;
        game.lastPutCards = data.lastPutCards;

        if (data.curPutterSeat == data.lastPutterSeat) { game.lastPutCards = []; }

        $('#home #game #putter_name').html(game.players[data.curPutterSeat].name);
    });

    socket.on('PlayerFinish', function (data) {
        renderer.drawRank(data.seat, data.rank);
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
        switch (game.stage) {
            case game.StageType.CHOOSE_GAME:
                // update room info
                break;
            case game.StageType.WAITING:
                smoke.signal(data.name + ' leaved the game !');
                renderer.updateWaitingPage(data);
                break;
            case game.StageType.PLAYING:
                break;
        }
    });

    socket.on('GameAbort', function (data) {
        smoke.signal(data.msg);
        socket.emit('GameList', {});
    });

    socket.on('GameOver', function (data) {
        if (data.is0_2Win && (game.mySeat == 0 || game.mySeat == 2)) { smoke.signal('You win!'); }
        if (!data.is0_2Win && (game.mySeat == 1 || game.mySeat == 3)) { smoke.signal('You lose!'); }
        socket.emit('GameList', {});
    });

    socket.on('GameListUpdate', function (data) {
        if (game.stage == game.StageType.CHOOSE_GAME) {
            socket.emit('GameList', {});
        }
    });
});
