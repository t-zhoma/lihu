(function (exports) {
    var gamejs = new require('../game.js');

    var Game = gamejs.Game;
    var Card = gamejs.Card;

    Game.prototype.deck = [];
    Game.prototype.firstPutterSeat = 0;
    Game.prototype.curPutterSeat = 0; // seat of the current put player
    Game.prototype.lihuResponsNum = 0;
    Game.prototype.lihuType = 0; // 0:no lihu, 1: one lihu, 2 two lihu
    Game.prototype.needPut = [];
    Game.prototype.needPutCount = 0;

    // Rules of lihu, each bit of index of array means the lihuResons of each player in the room
    // firstPutterSeat map to the low bit of index
    // i.e. lihuRule[3] means seat (firstPutter+2)%4 and (firstPutterSeat+3)%4 lihu, the others not lihu
    Game.prototype.lihuRule = [{ firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 0 },
                               { firstPutterSeat: 3, needPut: [true, false, true, true], needPutCount: 3, lihuType: 1 },
                               { firstPutterSeat: 2, needPut: [false, true, true, true], needPutCount: 3, lihuType: 1 },
                               { firstPutterSeat: 2, needPut: [false, false, true, true], needPutCount: 2, lihuType: 2 },
                               { firstPutterSeat: 1, needPut: [true, true, true, false], needPutCount: 3, lihuType: 1 },
                               { firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 1, needPut: [false, true, true, false], needPutCount: 2, lihuType: 2 },
                               { firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, false, true], needPutCount: 3, lihuType: 1 },
                               { firstPutterSeat: 0, needPut: [true, false, false, true], needPutCount: 2, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, false, false], needPutCount: 2, lihuType: 2 },
                               { firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2 },
                               { firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2}];

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

    // lihu type
    Game.prototype.calcLihuType = function () {
        var idx = 0;
        for (var i = 0; i < 4; i++) {
            if (this.players[(this.firstPutterSeat + i) % 4].isLihu) { idx += Math.pow(2, 3 - i); }
        }

        this.curPutterSeat = this.lihuRule[idx].firstPutterSeat;
        this.firstPutterSeat = this.lihuRule[idx].firstPutterSeat;
        this.needPut = [this.lihuRule[idx].needPut[0], this.lihuRule[idx].needPut[1], 
                        this.lihuRule[idx].needPut[2], this.lihuRule[idx].needPut[3]];
        this.needPutCount = this.lihuRule[idx].needPutCount;
        this.lihuType = this.lihuRule[idx].lihuType;

        console.log('lihuType: ' + this.lihuType + ', needPutCount: ' + this.needPutCount + ', firstPutterSeat: ' + this.firstPutterSeat);
    }

    Game.prototype.getLihuPlayersName = function () {
        var players = [];
        for (var i = 0; i < 4; i++) {
            if (this.players[i].isLihu) { players.push(this.players[i].name); }
        }
        return players;
    }

    Game.prototype.getPlayers = function () {
        var players = [];

        for (var i = 0; i < 4; i++) {
            if (this.players[i] == null) {
                players[i] = null;
            }
            else {
                players[i] = this.players[i].clone();
            }
        }

        return players;
    }

    exports.Game = Game;
    exports.Player = gamejs.Player;
    exports.Put = gamejs.Put;
})(exports);