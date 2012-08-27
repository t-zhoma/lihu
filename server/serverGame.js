(function (exports) {
    var gamejs = new require('../public/game.js');

    var Game = gamejs.Game;
    var Card = gamejs.Card;

    Game.prototype.deck = [];
    Game.prototype.firstPutterSeat = 0;
    Game.prototype.curPutterSeat = 0;      // seat of the current put player
    Game.prototype.lihuResponsNum = 0;
    Game.prototype.lihuType = 0;          // 0:no lihu, 1: one lihu, 2: two lihu
    Game.prototype.lihu2Type = 0;        // 0:0_1 li, 1: 0_3 li, 2: 0_2 li
    Game.prototype.needPut = [];
    Game.prototype.needPutCount = 0;
    Game.prototype.finishPlayers = [];     // Players that have put all cards in current round
    Game.prototype.isStart = false;

    // Rules of lihu, each bit of index of array means the lihuResons of each player in the room
    // firstPutterSeat map to the low bit of index
    // i.e. lihuRule[3] means seat (firstPutter+2)%4 and (firstPutterSeat+3)%4 lihu, the others not lihu
    Game.prototype.lihuRule = [{ firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 0 },                 // 0000
                               {firstPutterSeat: 3, needPut: [true, false, true, true], needPutCount: 3, lihuType: 1 },                 // 0001
                               {firstPutterSeat: 2, needPut: [false, true, true, true], needPutCount: 3, lihuType: 1 },                 // 0010
                               {firstPutterSeat: 2, needPut: [false, false, true, true], needPutCount: 2, lihuType: 2, lihu2Type: 0 },  // 0011
                               {firstPutterSeat: 1, needPut: [true, true, true, false], needPutCount: 3, lihuType: 1 },                 // 0100
                               {firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 0101
                               {firstPutterSeat: 1, needPut: [false, true, true, false], needPutCount: 2, lihuType: 2, lihu2Type: 0 },  // 0110
                               {firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 0111
                               {firstPutterSeat: 0, needPut: [true, true, false, true], needPutCount: 3, lihuType: 1 },                 // 1000
                               {firstPutterSeat: 0, needPut: [true, false, false, true], needPutCount: 2, lihuType: 2, lihu2Type: 1 },  // 1001
                               {firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 1010
                               {firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 1011
                               {firstPutterSeat: 0, needPut: [true, true, false, false], needPutCount: 2, lihuType: 2, lihu2Type: 0 },  // 1100
                               {firstPutterSeat: 1, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 1101
                               {firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2 },    // 1110
                               {firstPutterSeat: 0, needPut: [true, true, true, true], needPutCount: 4, lihuType: 2, lihu2Type: 2}];    // 1111

    // Rules of level calculate, structual:
    // |----not level 'a'
    // |    |----lihu type 0
    // |    |    |----finish players's length 0
    // |    |    |    |----finish players(include order)
    // |    |    |         |----results
    // |    |    |----finish players's length 1
    // |    |    |    |....
    // |    |    |----finish players's length 2
    // |    |    |    |....
    // |    |    |----finish players's length 3
    // |    |    |    |....
    // |    |----lihu type 1
    // |    |    |----finish player
    // |    |         |----results
    // |    |----lihu type 2
    // |         |----0_1 li
    // |         |    |----finish players's length 0
    // |         |    |----finish players's length 1
    // |         |         |----finish players(include order)
    // |         |              |----results
    // |         |----0_3 li
    // |         |    |....
    // |         |----0_2 li
    // |              |....
    // |    
    // |----level 'a'
    // |    |----finish players's length 0
    // |    |----finish players's length 1
    // |    |    |----finish players(include order)
    // |    |         |----results
    // |    |----finish players's length 2
    // |         |....
    // |    |----finish players's length 3
    // |         |....

    Game.prototype.levelRule = [[[[],
				                [{ isRoundOver: false }, { isRoundOver: false }, { isRoundOver: false }, { isRoundOver: false}], // len 1
	                           [[{}, { isRoundOver: false }, { isRoundOver: true, is0_2Win: true, levels: 2 }, { isRoundOver: false}],
				                [{ isRoundOver: false }, {}, { isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 2}],
				                [{ isRoundOver: true, is0_2Win: true, levels: 2 }, { isRoundOver: false }, {}, { isRoundOver: false}],
				                [{ isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 2 }, { isRoundOver: false }, {}]], // len 2
	                          [[[{}, {}, {}, {}],
				                [{}, {}, { isRoundOver: true, is0_2Win: true, levels: 1 }, { isRoundOver: true, is0_2Win: true, levels: 0}],
					            [{}, {}, {}, {}],
					            [{}, { isRoundOver: true, is0_2Win: true, levels: 0 }, { isRoundOver: true, is0_2Win: true, levels: 1 }, {}]],
					           [[{}, {}, { isRoundOver: true, is0_2Win: false, levels: 0 }, { isRoundOver: true, is0_2Win: false, levels: 1}],
					            [{}, {}, {}, {}],
					            [{ isRoundOver: true, is0_2Win: false, levels: 0 }, {}, {}, { isRoundOver: true, is0_2Win: false, levels: 1}],
					            [{}, {}, {}, {}]],
					           [[{}, {}, {}, {}],
					            [{ isRoundOver: true, is0_2Win: true, levels: 1 }, {}, {}, { isRoundOver: true, is0_2Win: true, levels: 0}],
					            [{}, {}, {}, {}],
					            [{ isRoundOver: true, is0_2Win: true, levels: 1 }, { isRoundOver: true, is0_2Win: true, levels: 0 }, {}, {}]],
					           [[{}, { isRoundOver: true, is0_2Win: false, levels: 1 }, { isRoundOver: true, is0_2Win: false, levels: 0 }, {}],
					            [{}, {}, {}, {}],
					            [{ isRoundOver: true, is0_2Win: false, levels: 0 }, { isRoundOver: true, is0_2Win: false, levels: 1 }, {}, {}],
					            [{}, {}, {}, {}]]]], // lihu type 0
				               [{ isRoundOver: true, is0_2Win: true, levels: 4 }, { isRoundOver: true, is0_2Win: false, levels: 4 },
                                {}, { isRoundOver: true, is0_2Win: false, levels: 4}], // lihu type 1
                               [[[],
                                 [{ isRoundOver: true, is0_2Win: true, levels: 8 }, { isRoundOver: true, is0_2Win: false, levels: 8}]],
                                [[],
                                 [{ isRoundOver: true, is0_2Win: true, levels: 8 }, {}, {}, { isRoundOver: true, is0_2Win: false, levels: 8}]],
                                [[],
                                 [{ isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 8 },
                                  { isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 8}],
                                 [[{}, { isRoundOver: true, is0_2Win: false, levels: 8 },
                                   { isRoundOver: true, is0_2Win: true, levels: 8 }, { isRoundOver: true, is0_2Win: false, levels: 8}],
                                  [],
                                  [{ isRoundOver: true, is0_2Win: true, levels: 8 }, { isRoundOver: true, is0_2Win: false, levels: 8 },
                                   {}, { isRoundOver: true, is0_2Win: false, levels: 8}]]]]], // lihu type 2
				              [[],
                               [{ isRoundOver: false }, { isRoundOver: false }, { isRoundOver: false }, { isRoundOver: false}],
                               [[{}, { isRoundOver: true, is0_2Win: true, levels: 0 }, { isRoundOver: true, is0_2Win: true, levels: 1 }, { isRoundOver: true, is0_2Win: true, levels: 0}],
                                [{ isRoundOver: false }, {}, { isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 2}],
                                [{ isRoundOver: true, is0_2Win: true, levels: 1 }, { isRoundOver: true, is0_2Win: true, levels: 0 }, {}, { isRoundOver: true, is0_2Win: true, levels: 0}],
                                [{ isRoundOver: false }, { isRoundOver: true, is0_2Win: false, levels: 2 }, { isRoundOver: false }, {}]],
                               [[],
                                [[{}, {}, { isRoundOver: true, is0_2Win: false, levels: 0 }, { isRoundOver: true, is0_2Win: false, levels: 1}],
                                 [],
                                 [{ isRoundOver: true, is0_2Win: false, levels: 0 }, {}, {}, { isRoundOver: true, is0_2Win: false, levels: 1}]],
                                [],
                                [[{}, { isRoundOver: true, is0_2Win: false, levels: 1 }, { isRoundOver: true, is0_2Win: false, levels: 0 }, {}],
                                 [],
                                 [{ isRoundOver: true, is0_2Win: false, levels: 0 }, { isRoundOver: true, is0_2Win: false, levels: 1 }, {}, {}]]]]];

    // Function related to card logic
    Game.prototype.builddeck = function () {
        var n;
        var si;
        var src;

        for (var si = 0; si < 4; si++) {
            for (var n = 0; n < 13; n++) {
                src = "img/" + this.suitnames[si] + "-" + this.cardNums[n] + "-75.png";
                this.deck.push(new Card(this.suitnames[si], n, src));
            }
        }

        this.deck.push(new Card("", 13, "img/joker-b-75.png"));     // joker-b
        this.deck.push(new Card("", 14, "img/joker-r-75.png"));     // joker-r
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
        var offset = this.firstPutterSeat;
        for (var i = 0; i < 4; i++) {
            if (this.players[(offset + i) % 4].isLihu) { idx += Math.pow(2, 3 - i); }
        }

        this.firstPutterSeat = (this.lihuRule[idx].firstPutterSeat + offset) % 4;
        this.curPutterSeat = this.firstPutterSeat;
        this.needPut = [this.lihuRule[idx].needPut[(0 - offset + 4) % 4], this.lihuRule[idx].needPut[(1 - offset + 4) % 4],
                        this.lihuRule[idx].needPut[(2 - offset + 4) % 4], this.lihuRule[idx].needPut[(3 - offset + 4) % 4]];
        this.needPutCount = this.lihuRule[idx].needPutCount;
        this.lihuType = this.lihuRule[idx].lihuType;
        this.lihu2Type = this.lihuRule[idx].lihu2Type;

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

    Game.prototype.initPlayers = function () {
        this.players = []; // 4 player, init empty seat
        for (var j = 0; j < 4; j++) { this.players.push(null); }
    }

    Game.prototype.addFinishPlayer = function (seat) {
        this.finishPlayers.push(seat);
        var ret = { isGameOver: false, isRoundOver: false, rank: this.finishPlayers.length };

        var res = null;
        if (this.getCurrentLevel() == 11) { // level 'a'
            res = this.levelRule[1][this.finishPlayers.length];
        }
        else { // not level 'a'
            res = this.levelRule[0][this.lihuType];

            switch (this.lihuType) {
                case 0:
                    res = res[this.finishPlayers.length];
                    break;
                case 1:
                    break;
                case 2:
                    res = res[this.lihu2Type][this.finishPlayers.length];
                    break;
            }
        }

        for (var i = 0; i < this.finishPlayers.length; i++) {
            res = res[(this.finishPlayers[i] - this.firstPutterSeat + 4) % 4];
        }

        if (res.isRoundOver) {
            ret.isRoundOver = true;
            var is0_2Win = res.is0_2Win;
            if (this.firstPutterSeat == 1 || this.firstPutterSeat == 3) { is0_2Win = !is0_2Win; }
            console.log('isRoundOver: ' + res.isRoundOver + ' ,is0_2Win: ' + is0_2Win + ' ,add levels: ' + res.levels);

            // is game over ?
            if (this.getCurrentLevel() == 11) { // > level 'a'
                if (is0_2Win && this.isLevel_0_2 && res.levels > 0) {
                    // game over 0_2 win
                    ret.isGameOver = true;
                    ret.is0_2Win = true;
                }

                if (!is0_2Win && !this.isLevel_0_2 && res.levels > 0) {
                    // game over 1_3 win
                    ret.isGameOver = true;
                    ret.is0_2Win = false;
                }

                if (ret.isGameOver) { console.log('GameOver!'); }
            }

            // calc new level & firstPutter in next round
            if (!ret.isGameOver) {
                this.addLevel(is0_2Win, res.levels);
                for (var i = 0; i < this.finishPlayers.length; i++) {
                    var seat = this.finishPlayers[i];
                    if (res.is0_2Win && (seat == 0 || seat == 2)) { this.firstPutterSeat = seat; break; }
                    if (!res.is0_2Win && (seat == 1 || seat == 3)) { this.firstPutterSeat = seat; break; }
                }
            }
        }

        return ret;
    }

    // user leave room,
    Game.prototype.leaveRoom = function () {
        this.initPlayers();
    }

    Game.prototype.inRoom = function (name) {
        for( var idx in this.players ) {
            if ( this.players[idx] === null ) continue;
            if ( this.players[idx].name == name ) {
                return true;
            }
        }
        return false;
    } 

    exports.Game = Game;
    exports.Player = gamejs.Player;
    exports.Put = gamejs.Put;
})(exports);