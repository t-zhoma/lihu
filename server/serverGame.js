(function (exports) {
    var gamejs = new require('../game.js');

    var Game = gamejs.Game;
    var Card = gamejs.Card;

    Game.prototype.deck = [];
    Game.prototype.firstPutterSeat = 0;

    // Function related to card logic
    Game.prototype.builddeck = function () {
        var n;
        var si;
        var src;

        for (var si = 0; si < 4; si++) {
            for (var n = 0; n < 13; n++) {
                src = "img\\" + this.suitnames[si] + "-" + this.cardNums[n] + "-75.png";
                this.deck.push(new Card(this.suitnames[si], n, src));
            }
        }

        this.deck.push(new Card("", 13, "img\\joker-b-75.png"));     // joker-b
        this.deck.push(new Card("", 14, "img\\joker-r-75.png"));     // joker-r
    }

    Game.prototype.shuffle = function () {
        var i = this.deck.length - 1;
        var s;
        while (i > 0) {
            s = Math.floor(Math.random() * (i + 1));
            this.swapcard(this.deck, s, i);
            i--;
        }

        for (i = 0; i < 54; i++) {
            this.players[(this.firstPutterSeat + i) % 4].cards.push(this.deck[i]);
        }

        for (i = 0; i < 4; i++) {
            this.players[i].cardsNum = this.players[i].cards.length;
        }
    }

    // game start
    Game.prototype.start = function () {
        // reset cards
        this.deck = [];
        for (var i = 0; i < 4; i++) {
            this.players[i].cards = [];
            this.players[i].cardsNum = 0;
        }

        this.builddeck();
        this.shuffle();
        this.buildCardOrder();

        // sort cards
        for (var idx in this.players) {
            var cards = this.players[idx].cards;
            if (cards == undefined) continue;
            this.sort(cards);
        }
    };

    exports.Game = Game;
    exports.Player = gamejs.Player;
})(exports);