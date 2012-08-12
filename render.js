(function (exports) {

    var CanvasRenderer = function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    };

    CanvasRenderer.prototype.drawBox = function () {
        this.drawBottomBox();
        this.drawTopBox();
        this.drawLeftBox();
        this.drawRightBox();
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