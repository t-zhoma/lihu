(function (exports) {

    var CanvasRenderer = function () {
        this.canvas = document.getElementById('canvas');
        this.canvas.onselectstart = function () { return false; }
        this.ctx = this.canvas.getContext('2d');
    };

    CanvasRenderer.prototype.drawBox = function () {
        this.drawBottomBox();
        this.drawTopBox();
        this.drawLeftBox();
        this.drawRightBox();
        this.drawPlayersInfo();
    };

    CanvasRenderer.prototype.emptyPutCards = function () {
        renderer.drawTopOutbox([]);
        renderer.drawRightOutbox([]);
        renderer.drawLeftOutbox([]);
        renderer.drawBottomOutbox([]);
    };

    CanvasRenderer.prototype.drawLeftBox = function () {
        var h = Game.CARD_WIDTH + (game.lb.cardsNum - 1) * Game.CARD_SPACE;
        if (game.lb.cardsNum == 0) {
            h += Game.CARD_SPACE;
        }

        var x = game.lb.rect.x;
        var y = (game.lb.rect.h - h) / 2 + game.lb.rect.y;

        this.ctx.clearRect(game.lb.rect.x, game.lb.rect.y, game.lb.rect.w, game.lb.rect.h);

        for (i = 0; i < game.lb.cardsNum; i++) {
            this.ctx.drawImage(Source.imgMap["img/back-blue-h-75-1.png"], x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH);
            y += Game.CARD_SPACE;
        }

        if (game.lb.cardsNum != 0) {
            y -= Game.CARD_SPACE;
            this.fillTextCenter(game.lb.cardsNum, x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH, '30px Arial', 'red');
        }
    }

    CanvasRenderer.prototype.drawRightBox = function () {
        var h = Game.CARD_WIDTH + (game.rb.cardsNum - 1) * Game.CARD_SPACE;
        if (game.rb.cardsNum == 0) {
            h += Game.CARD_SPACE;
        }

        var x = game.rb.rect.x;
        var y = (game.rb.rect.h - h) / 2 + game.rb.rect.y;

        this.ctx.clearRect(game.rb.rect.x, game.rb.rect.y, game.rb.rect.w, game.rb.rect.h);
        for (i = 0; i < game.rb.cardsNum; i++) {
            this.ctx.drawImage(Source.imgMap["img/back-blue-h-75-1.png"], x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH);
            y += Game.CARD_SPACE;
        }

        if (game.rb.cardsNum != 0) {
            y -= Game.CARD_SPACE;
            this.fillTextCenter(game.rb.cardsNum, x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH, '30px Arial', 'red');
        }
    }

    CanvasRenderer.prototype.drawTopBox = function () {
        var w = Game.CARD_WIDTH + (game.tb.cardsNum - 1) * Game.CARD_SPACE;
        if (game.tb.cardsNum == 0) {
            w += Game.CARD_SPACE;
        }
        var x = (game.tb.rect.w - w) / 2 + game.tb.rect.x;
        var y = game.tb.rect.y;

        this.ctx.clearRect(game.tb.rect.x, game.tb.rect.y, game.tb.rect.w, game.tb.rect.h);
        for (i = 0; i < game.tb.cardsNum; i++) {
            this.ctx.drawImage(Source.imgMap["img/back-blue-75-1.png"], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }

        if (game.tb.cardsNum != 0) {
            x -= Game.CARD_SPACE;
            this.fillTextCenter(game.tb.cardsNum, x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT, '30px Arial', 'red');
        }
    }

    CanvasRenderer.prototype.drawBottomBox = function () {
        var w = Game.CARD_WIDTH + (game.bb.cards.length - 1) * Game.CARD_SPACE;
        if (game.bb.cards.length == 0) {
            w += Game.CARD_SPACE;
        }
        var x = (game.bb.rect.w - w) / 2 + game.bb.rect.x;
        var y = game.bb.rect.y;

        this.ctx.clearRect(game.bb.rect.x, game.bb.rect.y, game.bb.rect.w, game.bb.rect.h);
        for (i = 0; i < game.bb.cards.length; i++) {
            var realY = game.bb.cards[i].selected ? y : (y + Game.CARD_EXTEND);
            this.ctx.drawImage(Source.imgMap[game.bb.cards[i].src], x, realY, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            game.bb.cards[i].x = x;
            game.bb.cards[i].y = realY;
            x += Game.CARD_SPACE;
        }
    }


    CanvasRenderer.prototype.drawBottomOutbox = function (cards) {
        this.ctx.clearRect(game.bob.rect.x, game.bob.rect.y, game.bob.rect.w, game.bob.rect.h);

        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }

        var x = (game.bob.rect.w - w) / 2 + game.bob.rect.x;
        var y = game.bob.rect.y;

        if (cards.length == 0) {
            this.ctx.fillText('Hold', x, y + Game.CARD_HEIGHT / 2);
            return;
        }

        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawTopOutbox = function (cards) {
        this.ctx.clearRect(game.tob.rect.x, game.tob.rect.y, game.tob.rect.w, game.tob.rect.h);

        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }
        var x = (game.tob.rect.w - w) / 2 + game.tob.rect.x;
        var y = game.tob.rect.y;

        if (cards.length == 0) {
            this.ctx.fillText('Hold', x, y + Game.CARD_HEIGHT / 2);
            return;
        }

        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawLeftOutbox = function (cards) {
        this.ctx.clearRect(game.lob.rect.x, game.lob.rect.y, game.lob.rect.w, game.lob.rect.h);

        var x = game.lob.rect.x;
        var y = game.lob.rect.y;

        if (cards.length == 0) {
            this.ctx.fillText('Hold', x, y + Game.CARD_HEIGHT / 2);
            return;
        }

        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawRightOutbox = function (cards) {
        this.ctx.clearRect(game.rob.rect.x, game.rob.rect.y, game.rob.rect.w, game.rob.rect.h);

        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }
        var x = game.rob.rect.w - w + game.rob.rect.x;
        var y = game.rob.rect.y;

        if (cards.length == 0) {
            this.ctx.fillText('Hold', x, y + Game.CARD_HEIGHT / 2);
            return;
        }

        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }


    CanvasRenderer.prototype.drawPutCards = function (putterSeat, putCards) {
        // bb
        if (putterSeat == game.mySeat) { return; } // Already draw when put

        // rb
        if ((game.mySeat + 1) % 4 == putterSeat) {
            renderer.drawRightBox();
            renderer.drawRightOutbox(putCards);
        }

        // tb
        if ((game.mySeat + 2) % 4 == putterSeat) {
            renderer.drawTopBox();
            renderer.drawTopOutbox(putCards);
        }

        // lb
        if ((game.mySeat + 3) % 4 == putterSeat) {
            renderer.drawLeftBox();
            renderer.drawLeftOutbox(putCards);
        }
    }

    CanvasRenderer.prototype.drawPlayersInfo = function () {
        this.ctx.font = '20pt Calibri';
        this.ctx.fillStyle = 'black';

        for (var i = 0; i < 4; i++) {
            switch ((i - game.mySeat + 4) % 4) {
                case 0: // bottom
                    this.ctx.fillText(game.players[i].name, game.bn.x, game.bn.y, game.bn.w);
                    break;
                case 1: // right
                    this.ctx.fillText(game.players[i].name, game.rn.x, game.rn.y, game.rn.w);
                    break;
                case 2: // top
                    this.ctx.fillText(game.players[i].name, game.tn.x, game.tn.y, game.tn.w);
                    break;
                case 3: // left
                    this.ctx.fillText(game.players[i].name, game.ln.x, game.ln.y, game.ln.w);
                    break;
            }
        }
    }

    CanvasRenderer.prototype.updateWaitingPage = function (data) {
        $('#nav_bar #room_id').html(data.room);
        for (var i = 0; i < data.players.length; i++) {
            var player = data.players[i];
            var name = player == null ? '' : player.name;
            $('#waiting ' + game.tagName[i]).html(name);
        }
    }

    CanvasRenderer.prototype.drawGameList = function () {

        var roomHtml = '';

        for (var i = 0; i < game.gameList.length; i++) {
            // Room
            var players = game.gameList[i];
            roomHtml += "<div class='room-item fl'>" +
                        "<div class='room-name'>Room " + i + "</div>" +
                        "<table>" +
                        "   <tr>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='2' room ='" + i + "' >" + (players[2] == null ? "" : players[2].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "    </tr>" +
                        "    <tr>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='3' room ='" + i + "' >" + (players[3] == null ? "" : players[3].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='1' room ='" + i + "' >" + (players[1] == null ? "" : players[1].name) + "</div>" +
                        "        </td>" +
                        "    </tr>" +
                        "    <tr>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='0' room ='" + i + "' >" + (players[0] == null ? "" : players[0].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "    </tr>" +
                        "</table>" +
                    "</div>";
        }

        roomHtml += "<div class='clr'></div>";
        $('#room_list').html(roomHtml);


        $('#room_list .seat').click(function () {
            var name = $(this).html();
            var seat = $(this).attr('seat');
            var room = $(this).attr('room')

            if (name != '') {
                smoke.alert('This seat already have player!');
            }
            else if (game.myName != '') {
                name = game.myName;
                game.enterRoom(parseInt(room), parseInt(seat), name);
            }
            else {
                smoke.prompt("what is your name", function (name) {

                    if (!name || $.trim(name) == '') {
                        smoke.signal('sorry, name required');
                    } else if ($.trim(name).length > 8) {
                        smoke.signal('name length must less than 10');
                    } else {
                        game.enterRoom(parseInt(room), parseInt(seat), $.trim(name));
                    }
                });
            }
        });

    }

    CanvasRenderer.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    CanvasRenderer.prototype.drawRank = function (seat, rank) {
        var font = '30px Arial';
        var fillStyle = 'red';

        // bb
        if (seat == game.mySeat) {
            this.fillTextCenter('Rank ' + rank, game.bb.rect.x, game.bb.rect.y, game.bb.rect.w, game.bb.rect.h, font, fillStyle);
        }

        // rb
        if ((game.mySeat + 1) % 4 == seat) {
            this.fillTextCenter('Rank ' + rank, game.rb.rect.x, game.rb.rect.y, game.rb.rect.w, game.rb.rect.h, font, fillStyle);
        }

        // tb
        if ((game.mySeat + 2) % 4 == seat) {
            this.fillTextCenter('Rank ' + rank, game.tb.rect.x, game.tb.rect.y, game.tb.rect.w, game.tb.rect.h, font, fillStyle);
        }

        // lb
        if ((game.mySeat + 3) % 4 == seat) {
            this.fillTextCenter('Rank ' + rank, game.lb.rect.x, game.lb.rect.y, game.lb.rect.w, game.lb.rect.h, font, fillStyle);
        }
    }

    CanvasRenderer.prototype.fillTextCenter = function (text, x, y, w, h, font, fillStyle) {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = 'center';
        var metrics = this.ctx.measureText(text);
        var xReal = x + w / 2;
        var yReal = y + h / 2 + 10;
        this.ctx.fillText(text, xReal, yReal);
        this.ctx.textAlign = 'start';
    }

    CanvasRenderer.prototype.drawCountDown = function (num) {
        var num = $('#count_down #count_down_num').html();
        if (isNaN(num) || (parseInt(num) - 1 <= 0)) {
            // disable button
            $('#btnHold').attr('disabled', true);
            $('#btnPrompt').attr('disabled', true);
            $('#btnPut').attr('disabled', true);

            clearInterval(putInt);
            $('#count_down').fadeOut('slow');

            if (game.curPutterSeat != game.mySeat) {
                return;
            }

            // promote
            game.prompt();
            if (game.isValidPut() == false) {
                game.hold();
            } else {
                game.put();
            }
            return;
        }
        $('#count_down #count_down_num').html(parseInt(num) - 1);
    }

    CanvasRenderer.prototype.drawWatchMark = function (needPut) {
        var font = '30px Arial';
        var fillStyle = 'red';

        // bb
        if (!needPut[0]) {
            this.fillTextCenter('Watch', game.bb.rect.x, game.bb.rect.y, game.bb.rect.w, game.bb.rect.h, font, fillStyle);
        }

        // rb
        if (!needPut[1]) {
            this.fillTextCenter('Watch', game.rb.rect.x, game.rb.rect.y, game.rb.rect.w, game.rb.rect.h, font, fillStyle);
        }

        // tb
        if (!needPut[2]) {
            this.fillTextCenter('Watch', game.tb.rect.x, game.tb.rect.y, game.tb.rect.w, game.tb.rect.h, font, fillStyle);
        }

        // lb
        if (!needPut[3]) {
            this.fillTextCenter('Watch', game.lb.rect.x, game.lb.rect.y, game.lb.rect.w, game.lb.rect.h, font, fillStyle);
        }
    }

    // TODO
    // for cache & preload 
    var Source = {
        imgMap: false,
        getImg: function (src) {
            console.log(Source.imgMap);
            if (Source.imgMap == false) return false;
            return Source.imgMap[src];
        }
    };


    exports.Source = Source;
    exports.Renderer = CanvasRenderer;
})(window);