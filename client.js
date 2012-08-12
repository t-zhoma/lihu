game = new Game();
renderer = new Renderer();
controller = new Controller();
//var input = new Input(game);
//sound = new SoundManager();

var clientID = Util.guidGenerator();


function preloadImg() { 
    game.buildImgSrcs();
    var imgPreloader = new ImagePreloader(game.imgSrcs, ImagePreloadCallback);
}

function ImagePreloadCallback(imgMap, nLoaded) {
    if (nLoaded != game.imgSrcs.length) {
        alert("Only " + nLoaded + " of " + game.imgSrcs.length + " images load successful!");
        return;
    }

    Source.imgMap = imgMap;
    init();
}

function init() {    
    game.builddeck();
    game.shuffle();
    game.buildCardOrder();
    game.fillbox();
    game.sort( game.bb.cards);
 
    renderer.drawBox();
}


window.onload = preloadImg;


document.addEventListener('DOMContentLoaded', function() {

// Globals
//socket = io.connect('http://o.smus.com:5050');
//socket = io.connect('http://localhost:5050');

});
