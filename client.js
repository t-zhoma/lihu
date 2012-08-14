game = new Game();
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
    $('#home').hide();
    $('#room_block').show();

    $('#btnPut').attr('disabled', true);
    $('#butHold').attr('disabled', true);
    $('#butPrompt').attr('disabled', true); 
}

function init() {    
    // game.builddeck();
    // game.shuffle();
    game.buildCardOrder();
    game.fillbox();
    game.sort( game.bb.cards);
 
    renderer.drawBox();
}


window.onload = preloadImg;

document.addEventListener('DOMContentLoaded', function() {

    // Globals
    //socket = io.connect('http://o.smus.com:5050');
    socket = io.connect('http://localhost:8080');

    socket.on('enter room', function(data) {
        if ( data == undefined || data.players == false ) {
            $('#select_robot').show();
        } else {
            $('#select_robot').hide();
        }
    });
    // start game, get cards from server
    socket.on('join', function(data) {
        console.log('resv server join' + data);
        
        if ( data.code != 0 ) {
            alert('fail to join the game' + data.errorMsg);
            return ;
        }

        // save user
        game.players = data.players;

        $('#home #game').hide();
        $('#home #waiting').show();
        var userHtml = '';
        for( var idx in data.players ) {
            userHtml += '<li>' + data.players[idx].name + '</li>';
        }
        $('#home #waiting #player_list').html(userHtml);
        


    });
    
    // bradcast get user put cards and server result
    socket.on('put', function(data) {
        console.log('resv put');

        // update player cards and score status
        
        game.fillbox( data.players );
        game.lastCards = data.putCards; // put cards
        renderer.drawPutCards( data.putCards );
        game.curPutPlayerIdx = game.getIdxByPlayerId( data.nextPutPlayerId );
        $('#putter_name').html( game.players[ game.curPutPlayerIdx ].name );
        if ( game.getCurrentPlayerIdx() != game.curPutPlayerIdx ) {
            $('#btnPut').attr('disabled', true);
            $('#btnHold').attr('disabled', true);
        } else {
            $('#btnPut').attr('disabled', false);
            $('#btnHold').attr('disabled', false);
        }
    });

    // start game, get cards from server
    socket.on('game start', function(data) {
        alert('game start');
        game.fillbox( data.players );
        game.curPutPlayerIdx = game.getIdxByPlayerId( data.nextPutPlayerId );
        game.sort( game.bb.cards);
        renderer.emptyPutCards();
        renderer.drawBox();
        $('#putter_name').html( game.players[ game.curPutPlayerIdx ].name );

        if ( game.getCurrentPlayerIdx() != game.curPutPlayerIdx ) {
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

    // start game, get cards from server
    socket.on('game over', function(data) {
        alert('game over! winner is ' + game.players[ game.getIdxByPlayerId( data.winnerId ) ].name );
    });

    socket.on('leave', function(data) {
        //leavePlayer = curGame.players[ curGame.getIdxByPlayerId( data.playerId) ];
        //console.log('user leave the game : ' + leavePlayer.name );
        alert('somebody leaved the game ');
        game.over();
        $('#room_block').fadeIn('slow');
        $('#home').fadeOut('slow');
    });

    $('#status').html('');
    var syncTime = 0;
    socket.on('time', function(data) {
        syncTime++;
        $('#status').html('sync times: ' + syncTime);
    });

});
