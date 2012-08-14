
(function (exports) {

    function Controller() {
        var ctx = this;

        $(document.body).mousedown(onMouseDown);
        function onMouseDown(evt) {
            controller.mouseDown(evt.pageX, evt.pageY);
        }
        $(document.body).mouseup(onMouseUp);
        function onMouseUp(evt) {
            controller.mouseUp(evt.pageX, evt.pageY);
        }

    $('#btnPut').click(function(){
        // TODO
        var selectedCards = new Array;
        for (var i = game.bb.cards.length - 1; i >= 0; i--) {
            if (game.bb.cards[i].selected) {
                selectedCards.push(game.bb.cards[i]);
                game.bb.cards.splice(i, 1);
            }
        }

        game.sort(selectedCards);

        if ( game.canPut(selectedCards) == false ) {
            alert('can not put this cards!');
            return false;
        }

        // TODO  verify whether can put

        // TODO send to server
        socket.emit('put', {
            cards: selectedCards,
            playerId: clientId
        });

        renderer.drawBottomBox();
        renderer.drawBottomOutbox(selectedCards);

    });
    $('#btnHold').click(function(){
        socket.emit('put', {
            cards: [],
            playerId: clientId
        });
    });
    $('#btnPrompt').click(function(){
        alert('prompt');
        game.prompt();
    });

    $('#quit_btn').click(function() {
        smoke.confirm('are you sure to quit the game?', function(e){
            if ( e ) {
                // confirm
                socket.emit('leave', {
                    playerId: clientId
                });
            } else {
                // cancel
            }
        });
    });

    $('#join_btn').click(function(){

        
        smoke.prompt("what is your name", function(name) {
            if (name) {
                //smoke.signal('name is: ' + name );
                $('#player_name').html(name);
                var robotCnt = $('#robot_cnt').val();
                socket.emit('join', 
                    {
                        roomId: $('#select_room_id').val(),
                        playerId: clientId,
                        playerName: name,
                        robotCnt: robotCnt
                    });
                

            } else {
               smoke.signal('sorry, name required');
            }
        });
    });
    }

    Controller.prototype.mouseDown = function (x, y) {
        game.startX = x;
        game.startY = y;
    }

    Controller.prototype.mouseUp = function (x, y) {
        if (game.bb.cards.length == 0) {
            return;
        }

        var x1 = Math.min(game.startX, x);
        var y1 = Math.min(game.startY, y);
        var w1 = Math.abs(game.startX - x);
        var h1 = Math.abs(game.startY - y);

        var last = game.bb.cards.length - 1;
        if (game.bb.cards[last].x < x1 && x1 < game.bb.cards[last].x + Game.CARD_WIDTH) { // Prevent error choose on the rightest card
            x1 = game.bb.cards[last].x + Game.CARD_SPACE - 1;
        }

        for (i = game.bb.cards.length - 1; i >= 0; i--) {
            if (Util.isRectCross(x1, y1, w1, h1, game.bb.cards[i].x, game.bb.cards[i].y, Game.CARD_WIDTH, Game.CARD_HEIGHT)) {
                game.bb.cards[i].selected = !game.bb.cards[i].selected;
                if (game.bb.cards[i].x < x1 && x1 < game.bb.cards[i].x + Game.CARD_SPACE) {
                    break;
                }
            }
        }

        renderer.drawBottomBox();
    }

    exports.Controller = Controller;

})(window);