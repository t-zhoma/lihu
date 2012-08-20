(function (exports) {
    var Box = function (cardsNum, rect) {
        this.cardsNum = cardsNum;
        this.rect = rect;
    }

    var BottomBox = function (rect) {
        this.cards = [];
        this.rect = rect;
    }

    var OutBox = function (rect) {
        this.rect = rect;
    }

    Game.CARD_WIDTH = 75;
    Game.CARD_HEIGHT = 107;
    Game.CARD_SPACE = 18;     // space btw cards
    Game.CARD_EXTEND = 25;    // extend space when card is selected
    
    game = new Game();
    game.gameList = [];
    game.seatPos = [new Rect(30, 90, 60, 30), new Rect(90, 30, 30, 60),
                new Rect(30, 0, 60, 30), new Rect(0, 30, 30, 60)];

    game.tagName = ['#bb', '#rb', '#tb', '#lb'];
    game.StageType = {
        CHOOSE_GAME: 0,
        WAITING: 1,
        PLAYING: 2
    };

    game.stage = game.StageType.CHOOSE_GAME;
    game.myName = '';
    game.myRoom = -1;
    game.mySeat = -1;
    game.playersInRoom = 0;

    game.tn = new Rect(550, 30, 100, 20);
    game.ln = new Rect(40, 415, 100, 20);
    game.rn = new Rect(1080, 415, 100, 20);
    game.bn = new Rect(550, 860, 100, 20);

    game.tb = new Box(14, new Rect(300, 50, 600, Game.CARD_HEIGHT));
    game.lb = new Box(14, new Rect(150, 125, Game.CARD_HEIGHT, 600));
    game.rb = new Box(14, new Rect(930, 125, Game.CARD_HEIGHT, 600));
    game.bb = new BottomBox(new Rect(300, 700, 600, Game.CARD_HEIGHT + Game.CARD_EXTEND));

    game.tob = new OutBox(new Rect(300, 167, 600, Game.CARD_HEIGHT));
    game.lob = new OutBox(new Rect(267, 396, 326, Game.CARD_HEIGHT));
    game.rob = new OutBox(new Rect(594, 396, 326, Game.CARD_HEIGHT));
    game.bob = new OutBox(new Rect(300, 583, 600, Game.CARD_HEIGHT));

    game.imgSrcs = new Array;

    // mouse down position
    game.startX = 0;
    game.startY = 0;

    game.buildImgSrcs = function () {
        var n;
        var si;
        var picname;
        for (var si = 0; si < 4; si++) {
            for (var n = 0; n < 13; n++) {
                picname = "img\\" + this.suitnames[si] + "-" + this.cardNums[n] + "-75.png";
                this.imgSrcs.push(picname);
            }
        }
        this.imgSrcs.push("img\\joker-b-75.png");
        this.imgSrcs.push("img\\joker-r-75.png");
        this.imgSrcs.push("img\\back-blue-75-1.png");
        this.imgSrcs.push("img\\back-blue-h-75-1.png");
    }

    game.hold = function () {
        if (game.lastPutterSeat == game.mySeat) {
            smoke.signal('Can not hold, please choose cards to put!');
            return;
        }

        allowPut(false);
        socket.emit('Put', { room: this.myRoom, seat: this.mySeat,
            putCards: new Array,
            remainCards: this.bb.cards
        });
        renderer.drawBottomOutbox(new Array);
    };

    game.prompt = function () {
        this.choosePrompt(this.bb.cards, this.lastPutCards);
        renderer.drawBottomBox();
    };

    game.put = function () {
        var selectedCards = this.getSelectedCards(this.bb.cards);

        // verify whether can put
        if (!game.compareCards(selectedCards, this.lastPutCards)) {
            smoke.signal('Invalid cards!');
            return;
        }

        allowPut(false);

        this.removeSelectedCards(this.bb.cards);

        // send to server
        socket.emit('Put', { room: this.myRoom, seat: this.mySeat,
            putCards: selectedCards,
            remainCards: this.bb.cards
        });

        renderer.drawBottomBox();
        renderer.drawBottomOutbox(selectedCards);
    }

    game.fillbox = function (players) {
        this.bb.cards = players[this.mySeat].cards;
        this.rb.cardsNum = players[(this.mySeat + 1) % 4].cardsNum;
        this.tb.cardsNum = players[(this.mySeat + 2) % 4].cardsNum;
        this.lb.cardsNum = players[(this.mySeat + 3) % 4].cardsNum;
    }

    exports.game = game;
})(window);