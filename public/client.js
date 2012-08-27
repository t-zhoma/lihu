renderer = new Renderer();
controller = new Controller();

var clientId = Util.guidGenerator();

function preloadImg() {
    $('#loading').show();
    game.buildImgSrcs();
    var imgPreloader = new ImagePreloader(game.imgSrcs, ImagePreloadCallback);
}

function ImagePreloadCallback(imgMap, nLoaded) {
    if (nLoaded != game.imgSrcs.length) {
        alert("Only " + nLoaded + " of " + game.imgSrcs.length + " images load successful!");
        return;
    }

    Source.imgMap = imgMap;
    $('#loading').fadeOut('slow', function() {
        $('#select_room').fadeIn('slow');
    });
}

window.onload = preloadImg;

// for count down
var putInt = false;

function allowPut(isAllow) {
    $('#btnHold').attr('disabled', !isAllow);
    $('#btnPrompt').attr('disabled', !isAllow);
    $('#btnPut').attr('disabled', !isAllow);
}

document.addEventListener('DOMContentLoaded', function () {
    // Globals
    socket = io.connect('http://' + window.location.host);

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

        showGameList();
    });

    // Self or other player enter room
    socket.on('EnterRoom', function (data) {
        if (data.code != 0) {
            alert('fail to join the game' + data.errorMsg);
            return;
        }

        if (game.stage == game.StageType.CHOOSE_GAME) {
            showWaitingRoom();

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
        showGameStart();

        game.stage = game.StageType.PLAYING;
        game.players = data.players;
        game.fillbox(data.players, true);

        game.curPutterSeat = data.curPutterSeat;
        game.level_0_2 = data.level_0_2;
        game.level_1_3 = data.level_1_3;
        game.isLevel_0_2 = data.isLevel_0_2;
        $('#cur_level').html(data.isLevel_0_2 ? game.level[data.level_0_2] : game.level[data.level_1_3]);
        var yourLevel = data.isLevel_0_2 ? (game.mySeat % 2 == 0) : (game.mySeat % 2 == 1);
        $('#your_level').html(yourLevel ? 'yes' : 'no');

        game.buildCardOrder();
        game.sort(game.bb.cards);
        renderer.clear();
        renderer.drawBox();

        allowPut(false);

        // li hu ?
        if (game.getCurrentLevel() != 11) { // 'a'
            smoke.confirm('Do you want to li hu?', function (e) { 
                socket.emit('lihu', { 
                    room: game.myRoom, 
                    seat: game.mySeat, 
                    isLihu: e 
                }); 
            });
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
        $('#home #nav_bar #lihu_player').html(tmp);

        // show count down
        createCountDown();
    });

    // bradcast get user put cards and server result
    socket.on('Put', function (data) {
        game.fillbox(data.players, false);
        renderer.drawPutCards(data.putterSeat, data.putCards);
    });

    socket.on('NewPut', function (data) {
        allowPut(data.curPutterSeat == game.mySeat);
        game.curPutterSeat = data.curPutterSeat;
        game.lastPutterSeat = data.lastPutterSeat;
        game.lastPutCards = data.lastPutCards;

        if (data.curPutterSeat == data.lastPutterSeat) {
            socket.emit('NewPutRound', {room: game.myRoom});
            game.lastPutCards = []; 
        }

        $('#opt_playing #putter_name').html(game.players[data.curPutterSeat].name);
        $('#count_down #putter_name').html(game.players[data.curPutterSeat].name);

        // show count down
        createCountDown();
    });

    socket.on('PlayerFinish', function (data) {
        renderer.drawRank(data.seat, data.rank);
    });

    socket.on('NewPutRound', {}, false);

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

    /*
    data {
        name: 
        room:
        msg:
    }
    */
    socket.on('RoomChat', function(data) {
        if ( isNaN(data.room) ||  data.msg == '' ||
        data.name == '' || data.room != game.myRoom) {
            // invalid data
            return;
        }
        var chatItem = '<div class="chat-msg-item">' + 
                            '<span class="username">[' + data.name +']</span>' + data.msg
                        '</div>';
        $("#chat_msg_list").append(chatItem);
        $("#chat_msg_list").scrollTop($("#chat_msg_list")[0].scrollHeight);
        
    });
});

function showWaitingRoom() {
    $('#select_room').fadeOut('slow', function() {
        $('#home #nav_bar #chat_msg_list').html('');
        $('#home #waiting').show();
        $('#home #nav_bar').show();
        $('#opt_playing').hide();
        $('#opt_waiting').show();
        $('#home #game').hide();
    });
}

function showGameStart() {
    // clean data
    $('#opt_playing #putter_name').html('');
    $('#opt_playing #cur_level').html('');
    $('#opt_playing #your_level').html('');
    $('#opt_playing #lihu_player').html('');

    $('#home #waiting').fadeOut('slow', function() {
        $('#home #game').show();
        $('#opt_playing').show();
        $('#opt_waiting').hide();
    });
    
}

function showGameList() {
    $('#home #waiting').hide();
    $('#home #game').hide();
    $('#home #nav_bar').hide();
    if ( $('#loading').is(':hidden') ) {
        $('#select_room').fadeIn('slow');
    }   
}

function createCountDown() {
    var num = 20;
    clearInterval(putInt);
    $('#home #game #count_down #count_down_num').html(num);
    $('#count_down').fadeIn('slow');
    putInt = setInterval(function(){renderer.drawCountDown()}, 1000);
}