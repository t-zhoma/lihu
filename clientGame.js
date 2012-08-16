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
        // TODO
        renderer.drawBottomOutbox(new Array);
    };

    game.prompt = function () {
        this.choosePrompt(this.bb.cards, this.lastCards);
        renderer.drawBottomBox();
    };

    // update user cards
    // caculate user score
    game.put = function (putPlayerId, cards) {
        // update cards status

        if (cards.length == 0) {
            // hold
        } else {
            // put

            for (var idx in this.players) {
                var player = this.players[idx];
                if (putPlayerId == player.id) {
                    console.log(' cards num ' + cards.length);

                    var tmpCards = [];
                    for (var idx01 in player.cards) {
                        var found = false;
                        for (var idx02 in cards) {
                            if (player.cards[idx01].isEqual(cards[idx02])) {
                                found = true; break;
                            }
                        }
                        if (found == false) {
                            tmpCards.push(player.cards[idx01]);
                        }
                    }

                    this.players[idx].cards = tmpCards;
                    // simple
                    this.players[idx].cardsNum -= cards.length;

                    break;
                }
            }
            this.lastCards = cards;
            this.lastPut = new Put(putPlayerId, cards);
        }
    }

    game.fillbox = function (players) {
        this.bb.cards = players[this.mySeat].cards;
        this.lb.cardsNum = players[(this.mySeat + 1) % 4].cardsNum;
        this.tb.cardsNum = players[(this.mySeat + 2) % 4].cardsNum;
        this.rb.cardsNum = players[(this.mySeat + 3) % 4].cardsNum;
    }

    exports.game = game;
})(window);