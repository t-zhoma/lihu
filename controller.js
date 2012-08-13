
(function(exports) {

function Controller() {
    var ctx = this;


    /*
    $(document.body).on('keydown', function(e) {
            switch (e.which) {
                case 37:
                    window.keyPress('left');
                    break;
                case 39:
                    window.keyPress('right');
                    break;
                case 38:
                    window.keyPress('up');
                    break;
                case 40:
                    window.keyPress('down');
                    break;
                default:
                    window.keyPress(String.fromCharCode(e.which).toLowerCase());
                    break;
            }
        });
    */

    $(document.body).mousedown(onMouseDown);
    function onMouseDown(evt) {
        controller.mouseDown(evt.pageX, evt.pageY);
    }
    $(document.body).mouseup(onMouseUp);
    function onMouseUp(evt) {
        controller.mouseUp(evt.pageX, evt.pageY);
    }

    $('#btnPut').click(function(){
        game.put();
    });
    $('#btnHold').click(function(){
        game.hold();
    });
    $('#btnPrompt').click(function(){
        alert('prompt');
        game.prompt();
    });

    $('#join').click(function(){
        smoke.prompt("what is your name", function(name) {
            if (name) {
                //smoke.signal('name is: ' + name );
                $('#player_name').html(name);
                socket.emit('join', 
                    {
                        roomId: game.roomId,
                        playerId: clientId,
                        playerName: name
                    });
            } else {
               smoke.signal('sorry, name required');
            }
        });
    });

}

Controller.prototype.keyPress = function(msg) {

}

Controller.prototype.mouseDown = function(x, y) {
    game.startX = x;
    game.startY = y;
}

Controller.prototype.mouseUp = function(x, y) {
    if ( game.bb.cards.length == 0) {
        return;
    }

    var x1 = Math.min( game.startX, x);
    var y1 = Math.min( game.startY, y);
    var w1 = Math.abs( game.startX - x);
    var h1 = Math.abs( game.startY - y);

    var last = game.bb.cards.length - 1;
    if ( game.bb.cards[last].x < x1 && x1 < game.bb.cards[last].x + Game.CARD_WIDTH) { // Prevent error choose on the rightest card
        x1 = game.bb.cards[last].x + Game.CARD_SPACE - 1;
    }
    
    for (i = game.bb.cards.length - 1; i >= 0; i--) {
        if ( Util.isRectCross(x1, y1, w1, h1, game.bb.cards[i].x, game.bb.cards[i].y, Game.CARD_WIDTH, Game.CARD_HEIGHT)) {
            game.bb.cards[i].selected = !game.bb.cards[i].selected;
            if ( game.bb.cards[i].x < x1 && x1 < game.bb.cards[i].x + Game.CARD_SPACE) {
                break;
            }
        }
    }

    renderer.drawBottomBox();
}

exports.Controller = Controller;

})(window);