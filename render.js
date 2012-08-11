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

        var x = Game.leftboxx;
        var y = (Game.leftboxh - h) / 2 + Game.leftboxy;

        this.ctx.clearRect(Game.leftboxx, Game.leftboxy, Game.leftboxw, Game.leftboxh);

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

        var x = Game.rightboxx;
        var y = (Game.rightboxh - h) / 2 + Game.rightboxy;

        this.ctx.clearRect(Game.rightboxx, Game.rightboxy, Game.rightboxw, Game.rightboxh);
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
        var x = (Game.topboxw - w) / 2 + Game.topboxx;
        var y = Game.topboxy;

        this.ctx.clearRect(Game.topboxx, Game.topboxy, Game.topboxw, Game.topboxh);
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
        var x = (Game.bottomboxw - w) / 2 + Game.bottomboxx;
        var y = Game.bottomboxy;

        this.ctx.clearRect(Game.bottomboxx, Game.bottomboxy, Game.bottomboxw, Game.bottomboxh);
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
        var x = (Game.bottomOutboxw - w) / 2 + Game.bottomOutboxx;
        var y = Game.bottomOutboxy;

        this.ctx.clearRect(Game.bottomOutboxx, Game.bottomOutboxy, Game.bottomOutboxw, Game.bottomOutboxh);
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
        var x = (Game.topOutboxw - w) / 2 + Game.topOutboxx;
        var y = Game.topOutboxy;

        this.ctx.clearRect(Game.topOutboxx, Game.topOutboxy, Game.topOutboxw, Game.topOutboxh);
        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
    }

    CanvasRenderer.prototype.drawLeftOutbox = function (cards) {
        var x = Game.leftOutboxx;
        var y = Game.leftOutboxy;

        this.ctx.clearRect(Game.leftOutboxx, Game.leftOutboxy, Game.leftOutboxw, Game.leftOutboxh);
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
        var x = Game.rightOutboxw - w + Game.rightOutboxx;
        var y = Game.rightOutboxy;

        this.ctx.clearRect(Game.rightOutboxx, Game.rightOutboxy, Game.rightOutboxw, Game.rightOutboxh);
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