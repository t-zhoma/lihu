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
            this.ctx.drawImage(Source.imgMap["img\\back-blue-h-75-1.png"], x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH);
            y += Game.CARD_SPACE;
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
            this.ctx.drawImage(Source.imgMap["img\\back-blue-h-75-1.png"], x, y, Game.CARD_HEIGHT, Game.CARD_WIDTH);
            y += Game.CARD_SPACE;
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
            this.ctx.drawImage(Source.imgMap["img\\back-blue-75-1.png"], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
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
        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }

        var x = (game.bob.rect.w - w) / 2 + game.bob.rect.x;
        var y = game.bob.rect.y;

        this.ctx.clearRect(game.bob.rect.x, game.bob.rect.y, game.bob.rect.w, game.bob.rect.h);
        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawTopOutbox = function (cards) {
        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }
        var x = (game.tob.rect.w - w) / 2 + game.tob.rect.x;
        var y = game.tob.rect.y;

        this.ctx.clearRect(game.tob.rect.x, game.tob.rect.y, game.tob.rect.w, game.tob.rect.h);
        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawLeftOutbox = function (cards) {
        var x = game.lob.rect.x;
        var y = game.lob.rect.y;

        this.ctx.clearRect(game.lob.rect.x, game.lob.rect.y, game.lob.rect.w, game.lob.rect.h);
        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawRightOutbox = function (cards) {
        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }
        var x = game.rob.rect.w - w + game.rob.rect.x;
        var y = game.rob.rect.y;

        this.ctx.clearRect(game.rob.rect.x, game.rob.rect.y, game.rob.rect.w, game.rob.rect.h);
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
        $('#home #waiting #room_id').html(data.room);
        for (var i = 0; i < data.players.length; i++) {
            var player = data.players[i];
            var name = player == null ? '' : player.name;
            $(game.tagName[i]).html(name);
        }
    }

    CanvasRenderer.prototype.drawGameList = function () {
        var x = 50, y = 50, cx = 120, cy = 120, gamesPerLine = 5;

        for (var i = 0; i < game.gameList.length; i++) {
            // Room
            this.ctx.fillStyle = 'gray';
            this.ctx.fillRect(x, y, cx, cy);
            game.gameList[i].rect = new Rect(x, y, cx, cy);

            // Seat, now just draw name
            for (var j = 0; j < 4; j++) {
                var player = game.gameList[i][j];
                if (player == null) { continue; }
                player.rect = new Rect(game.seatPos[j].x, game.seatPos[j].y,
                                       game.seatPos[j].w, game.seatPos[j].h);
                player.rect.x += x;
                player.rect.y += y;

                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(player.rect.x, player.rect.y, player.rect.w, player.rect.h);
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(player.name, player.rect.x, player.rect.y, player.rect.w, player.rect.h);
            }

            if (i % gamesPerLine == (gamesPerLine - 1)) { x = 50; y += 150; }
            else { x += 150; }
        }
    }

    CanvasRenderer.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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