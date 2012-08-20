(function (exports) {
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