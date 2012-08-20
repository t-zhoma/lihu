
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

        $('#btnPut').click(function () {
            game.put();
        });

        $('#btnStart').click(function () {
            if (game.playersInRoom < 4) {
                smoke.confirm('Not enough players, are you want to add robots and to start game?', function (e) {
                    if (e) {
                        socket.emit('StartGame', { room: game.myRoom, seat: game.mySeat });
                    }
                });
            }
            else {
                socket.emit('StartGame', { room: game.myRoom, seat: game.mySeat });
            }
        });

        $('#btnHold').click(function () {
            game.hold();
        });

        $('#btnPrompt').click(function () {
            game.prompt();
        });

        $('#quit_btn').click(function () {
            smoke.confirm('are you sure to quit?', function (e) {
                if (e) {
                    // confirm
                    switch (game.stage) {
                        case game.StageType.CHOOSE_GAME:
                            // Do nothing
                            break;
                        case game.StageType.WAITING:
                            socket.emit('LeaveRoom', { room: game.myRoom, seat: game.mySeat, name: game.myName });
                            socket.emit('GameList', {});
                            break;
                        case game.StageType.PLAYING:
                            socket.emit('LeaveRoom', { room: game.myRoom, seat: game.mySeat, name: game.myName });
                            socket.emit('GameList', {});
                            break;
                    }
                } else {
                    // cancel
                }
            });
        });
    }

    Controller.prototype.mouseDown = function (x, y) {
        if (game.stage == game.StageType.CHOOSE_GAME) {
            for (var i = 0; i < game.gameList.length; i++) {
                var gameRect = game.gameList[i].rect;
                if (game.gameList[i].rect.contain(x, y)) { // Room
                    for (var j = 0; j < game.seatPos.length; j++) { // Seat
                        if (game.seatPos[j].contain(x - gameRect.x, y - gameRect.y)) {
                            if (game.gameList[i][j] != null) {
                                smoke.alert('This seat already have player!');
                            }
                            else {
                                smoke.prompt("what is your name", function (name) {
                                    if (name && name != "") {
                                        game.myRoom = i;
                                        game.mySeat = j;
                                        game.myName = name;
                                        socket.emit('EnterRoom',
                                        {
                                            room: i,
                                            seat: j,
                                            playerName: name
                                        });
                                    } else {
                                        smoke.signal('sorry, name required');
                                    }
                                });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        } // end of if(isChooseGame)
        else {
            game.startX = x;
            game.startY = y;
        }
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