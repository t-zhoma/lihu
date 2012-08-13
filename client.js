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
    $('#home').show();
    $('#welcome_block').show();
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

    // start game, get cards from server
    socket.on('join', function(data) {
        console.log('resv server join' + data);
        
        if ( data.code != 0 ) {
            alert('fail to join the game' + data.errorMsg);
            return ;
        }

        // save user
        game.players = data.players;
        


    });
    
    // bradcast get user put cards and server result
    socket.on('put', function(data) {
        console.log('resv put');
    });

    // start game, get cards from server
    socket.on('game start', function(data) {
        alert('game start');
        game.players = data.players; // cards
        game.currPlayerIdx = data.currPlayerIdx;
        game.fillbox();
        game.sort( game.bb.cards);
        renderer.drawBox();
    });

    // start game, get cards from server
    socket.on('game over', function(data) {

    });

    $('#status').html('');
    var syncTime = 0;
    socket.on('time', function(data) {
        syncTime++;
        $('#status').html('sync times: ' + syncTime);
    });

});
