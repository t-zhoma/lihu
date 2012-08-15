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


    CanvasRenderer.prototype.drawPutCards = function (putCards) {
        // put player idx
        var putIdx = game.curPutPlayerIdx;
        // cur player idx
        var curIdx = game.getCurrentPlayerIdx();

        // bb
        if (curIdx == putIdx) {
            renderer.drawBottomBox();
            renderer.drawBottomOutbox(putCards);
        }

        // lb
        if ((curIdx + 1) % 4 == putIdx) {
            renderer.drawLeftBox();
            renderer.drawLeftOutbox(putCards);
        }

        // tb
        if ((curIdx + 2) % 4 == putIdx) {
            renderer.drawTopBox();
            renderer.drawTopOutbox(putCards);
        }

        // rb
        if ((curIdx + 3) % 4 == putIdx) {
            renderer.drawRightBox();
            renderer.drawRightOutbox(putCards);
        }

        this.drawPlayersInfo();

    }

    CanvasRenderer.prototype.drawPlayersInfo = function () {

        var curPlayerIdx = game.getCurrentPlayerIdx();
        var player;
        var curBox;
        this.ctx.font = '20pt Calibri';

        // bottom box
        player = game.players[curPlayerIdx];
        //this.ctx.fillText(player.name, );
        curPlayerIdx = game.getNextPlayerIdx(curPlayerIdx);

        // left box
        player = game.players[curPlayerIdx];
        curBox = game.lob.rect;
        this.ctx.fillText(player.name, curBox.x - 110, curBox.y + curBox.h + 130);
        curPlayerIdx = game.getNextPlayerIdx(curPlayerIdx);

        // up box
        player = game.players[curPlayerIdx];
        curBox = game.tob.rect;
        this.ctx.fillText(player.name, curBox.x - 50, curBox.y - 50);
        curPlayerIdx = game.getNextPlayerIdx(curPlayerIdx);

        // right box
        player = game.players[curPlayerIdx];
        curBox = game.rob.rect;
        this.ctx.fillText(player.name, curBox.x + 360, curBox.y + curBox.h + 130);
        curPlayerIdx = game.getNextPlayerIdx(curPlayerIdx);
    }

    CanvasRenderer.prototype.drawGameList = function () {
        var x = 50, y = 50, cx = 120, cy = 120, gamesPerLine = 5;

        for (var i = 0; i < game.gameList.length; i++) {
            // Room
            this.ctx.fillStyle = 'gray';
            this.ctx.fillRect(x, y, cx, cy);
            game.gameList[i].rect = new Rect(x, y, cx, cy);

            // Seat, now just draw name
            for (var j = 0; j < game.gameList[i].length; j++) {
                var player = game.gameList[i][j];
                player.rect = new Rect(game.seatPos[player.pos].x, game.seatPos[player.pos].y,
                                       game.seatPos[player.pos].w, game.seatPos[player.pos].h);
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