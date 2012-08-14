
(function (exports) {

    var Game = function () {
        // Card parameter
        Game.CARD_WIDTH = 75;
        Game.CARD_HEIGHT = 107;
        Game.CARD_SPACE = 18;     // space btw cards
        Game.CARD_EXTEND = 25;    // extend space when card is selected

        // Cards
        this.deck = [];
        this.imgSrcs = new Array;

        this.startX;
        this.startY;

        this.tb = new Box(14, new Rect(300, 50, 600, Game.CARD_HEIGHT));
        this.lb = new Box(14, new Rect(150, 125, Game.CARD_HEIGHT, 600));
        this.rb = new Box(14, new Rect(930, 125, Game.CARD_HEIGHT, 600));
        this.bb = new BottomBox(new Rect(300, 700, 600, Game.CARD_HEIGHT + Game.CARD_EXTEND));

        this.tob = new OutBox(new Rect(300, 167, 600, Game.CARD_HEIGHT));
        this.lob = new OutBox(new Rect(267, 396, 326, Game.CARD_HEIGHT));
        this.rob = new OutBox(new Rect(594, 396, 326, Game.CARD_HEIGHT));
        this.bob = new OutBox(new Rect(300, 583, 600, Game.CARD_HEIGHT));

        this.cardNums = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a", "2", "joker-b", "joker-r"];
        this.suitnames = ["clubs", "hearts", "spades", "diamonds"];
        this.cardOrder = new Object(); // Card order related to current level

        this.PutType = {
            SINGLE: 0,      // 单牌
            PAIR: 1,        // 对子
            PAIRS: 2,       // 连对（滚子）
            STRAIGHT: 3,    // 顺子
            THREE_BOMB: 4,  // 小炸弹（三张牌）
            FOUR_BOMB: 5,   // 大炸弹（四张牌）
            KING_BOMB: 6,   // 王炸（大小王）
            INVALID: 7      // 无效牌
        };

        // rule[i][j] means whether PutType i > j
        // 0: No, i.e. rule[PutType.SINGLE][PutType.KING_BOMB]
        // 1: Yes, i.e. rule[PutType.KING_BOMB][PutType.SINGLE]
        // 2: Maybe, i.e. rule[PutType.SINGLE][[PutType.SINGLE]]
        this.rule = [[2, 0, 0, 0, 0, 0, 0, 0],
                     [0, 2, 0, 0, 0, 0, 0, 0],
                     [0, 0, 2, 0, 0, 0, 0, 0],
                     [0, 0, 0, 2, 0, 0, 0, 0],
                     [1, 1, 0, 1, 2, 0, 0, 0],
                     [1, 1, 1, 1, 1, 2, 0, 0],
                     [1, 1, 1, 1, 1, 1, 0, 0],
                     [0, 0, 0, 0, 0, 0, 0, 0]];

        // level
        this.level = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
        this.ourLevel = 0;
        this.theirLevel = 0;
        this.ourRound = true;

        this.roomId;
        this.players = new Array; // 4 player
        this.curPutPlayerIdx; // current put player

        this.lastCards; // last put cards

    };

    Game.prototype.getIdxByPlayerId = function (playerId) {
        for (var idx in this.players) {
            var player = this.players[idx];
            if (player != false && player.id == playerId) {
                return parseInt(idx);
            }
        }
        return false;
    }

    Game.prototype.getCurrentPlayerIdx = function () {
        return this.getIdxByPlayerId(clientId);
    }

    Game.prototype.getNextPutPlayer = function () {
        // anticlockwise
        this.curPutPlayerIdx = parseInt(this.curPutPlayerIdx);
        this.curPutPlayerIdx = (this.curPutPlayerIdx - 1 + 4) % 4;
        return this.players[this.curPutPlayerIdx];
    }

    Game.prototype.getNextPlayerIdx = function (curIdx) {
        return (curIdx - 1 + 4) % 4;
    }

    Game.prototype.isGameOver = function () {
        // check is game over
        // if over return winner idx
        for (var i in this.players) {
            if (this.players[i].cardsNum <= 0) {
                return true;
            }
        }
        return false;
    }

    Game.prototype.over = function () {
        this.players = [];

    }
    Game.prototype.resetBox = function () {
        this.tb = new Box(14, new Rect(300, 50, 600, Game.CARD_HEIGHT));
        this.lb = new Box(14, new Rect(150, 125, Game.CARD_HEIGHT, 600));
        this.rb = new Box(14, new Rect(930, 125, Game.CARD_HEIGHT, 600));
        this.bb = new BottomBox(new Rect(300, 700, 600, Game.CARD_HEIGHT + Game.CARD_EXTEND));
    }

    Game.prototype.getWinnerId = function () {
        if (this.isGameOver() == false) return false;
        for (var idx in this.players) {
            if (this.players[idx].cardsNum == 0) {
                return this.players[idx].id;
            }
        }
    }

    // verify put cards
    Game.prototype.canPut = function (cards) {
        // TODO
        // 
        return true;
    }

    Game.prototype.put = function (putPlayerId, cards) {
        // update user cards
        // caculate user score

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
        }


    }

    Game.prototype.ready = function () {
        return ( this.players.length == 4 );
    }

    Game.prototype.start = function () {

        // reset cards
        this.deck = [];
        for(var i = 0; i<4; i++ ) {
            this.players[i].cards = [];
            this.players[i].cardsNum = 0;
        }

        this.builddeck();
        this.shuffle();
        this.buildCardOrder();

        // sort cards
        for (var idx in this.players) {
            this.sort(this.players[idx].cards);
        }

        // start user
        var startIdx = 3;
        // get a none robot user to start
        while (this.players[startIdx].isRobot == true) {
            startIdx = (startIdx + 1) % 4;
        }
        this.curPutPlayerIdx = startIdx;
    };

    Game.prototype.hold = function () {
        // TODO
        renderer.drawBottomOutbox(new Array);
    };

    Game.prototype.prompt = function () {
        this.choosePrompt(this.bb.cards, this.lastCards);
        renderer.drawBottomBox();
    };

    Game.prototype.buildImgSrcs = function () {
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

        for( i = 0; i < 54 ; i++) {
            this.players[ i%4 ].cards.push(this.deck[i]);
        }
        this.players[0].cardsNum = this.players[0].cards.length;
        this.players[1].cardsNum = this.players[1].cards.length;
        this.players[2].cardsNum = this.players[2].cards.length;
        this.players[3].cardsNum = this.players[3].cards.length;

    }

    Game.prototype.swapcard = function (cards, j, k) {
        var temp = new Card(cards[j].suit, cards[j].num, cards[j].src);
        cards[j] = cards[k];
        cards[k] = temp;
    }

    Game.prototype.fillbox = function (players) {
        this.players = players;
        var curIdx = this.getCurrentPlayerIdx();
        this.bb.cards = players[curIdx].cards;
        this.lb.cardsNum = players[(curIdx + 1) % 4].cardsNum;
        this.tb.cardsNum = players[(curIdx + 2) % 4].cardsNum;
        this.rb.cardsNum = players[(curIdx + 3) % 4].cardsNum;
    }

    // return true when card1 < card2, else return false, need buildCardOrder first
    Game.prototype.compare = function (card1, card2) {
        return this.getOrder(card1) < getOrder(card2);
    }

    Game.prototype.getOrder = function (card) {
        return this.cardOrder[this.cardFullName(card.suit, card.num)];
    }

    // Select sort(Desc), need buildCardOrder first
    Game.prototype.sort = function (cards) {
        var max;
        for (var i = 0; i < cards.length - 1; i++) {
            max = i;
            for (var j = i; j < cards.length; j++) {
                if (this.getOrder(cards[j]) > this.getOrder(cards[max])) {
                    max = j;
                }
            }
            this.swapcard(cards, i, max);
        }
    }

    Game.prototype.getCurrentLevel = function () {
        return this.ourRound ? this.ourLevel : this.theirLevel;
    }

    Game.prototype.cardFullName = function (suitname, num) {
        return suitname + " " + num;
    }

    Game.prototype.buildCardOrder = function () {
        var curLevel = this.getCurrentLevel();
        var suitnames = ["diamonds", "clubs", "spades", "hearts"];
        var i = 0;

        for (var j = 0; j < curLevel; j++) {
            for (var k = 0; k < suitnames.length; k++) {
                this.cardOrder[this.cardFullName(suitnames[k], j)] = i;
            }
            i++;
        }

        for (var j = curLevel + 1; j < this.level.length; j++) {
            for (var k = 0; k < suitnames.length; k++) {
                this.cardOrder[this.cardFullName(suitnames[k], j)] = i;
            }
            i++;
        }

        for (var k = 0; k < suitnames.length; k++) {
            if (suitnames[k] == "hearts") {
                i++;
            }
            this.cardOrder[this.cardFullName(suitnames[k], 12)] = i; // "2"
        }
        i++;

        for (var k = 0; k < suitnames.length; k++) {
            if (suitnames[k] == "hearts") {
                i++;
            }
            this.cardOrder[this.cardFullName(suitnames[k], curLevel)] = i;
        }
        i++

        this.cardOrder[this.cardFullName("", "13")] = i++; // joker-b
        this.cardOrder[this.cardFullName("", "14")] = i++; // joker-r
    }


    Game.prototype.getCardType = function (cards) {
        this.sort(cards);
        switch (cards.length) {
            case 1:
                return this.PutType.SINGLE;
            case 2:
                if ((cards[0].num == 14 && cards[1].num == 13)) { // "joker-r" and "joker-b"
                    return this.PutType.KING_BOMB;
                }
                else if (cards[0].num == cards[1].num) {
                    return this.PutType.PAIR;
                }
                break;
            case 3:
                if (cards[0].num == cards[1].num && cards[1].num == cards[2].num) {
                    return this.PutType.THREE_BOMB;
                }
                else if (this.isStraight(cards)) {
                    return this.PutType.STRAIGHT;
                }
                break;
            case 4:
                if (cards[0].num == cards[1].num && cards[1].num == cards[2].num && cards[2].num == cards[3].num) {
                    return this.PutType.FOUR_BOMB;
                }
                else if (this.isStraight(cards)) {
                    return this.PutType.STRAIGHT;
                }
                break;
            default:
                if (this.isPairs(cards)) {
                    return this.PutType.PAIRS;
                }
                else if (this.isStraight(cards)) {
                    return this.PutType.STRAIGHT;
                }
                break;
        }

        return this.PutType.INVALID;
    }

    Game.prototype.isStraight = function (cards) {
        if (cards.length < 3 || this.containSpecialCard(cards)) {
            return false;
        }

        this.sort(cards);

        for (var i = 0; i < cards.length - 1; i++) {
            if (cards[i].num != cards[i + 1].num + 1) {
                return false;
            }
        }

        return true;
    }

    Game.prototype.isPairs = function (cards) {
        if (cards.length < 6 || cards.length % 2 == 1 || this.containSpecialCard(cards))
            return false;

        this.sort(cards);
        for (var i = 0; i < cards.length - 3; i = i + 2) {
            if (cards[i].num != cards[i + 1].num || cards[i].num != cards[i + 2].num + 1 ||
           cards[i].num != cards[i + 3].num + 1) {
                return false;
            }
        }

        return true;
    }

    Game.prototype.containSpecialCard = function (cards) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].num == this.getCurrentLevel() || cards[i].num == 12 ||
           cards[i].num == 13 || cards[i].num == 14) { // master, "2", "joker-b" or "joker-r"
                return true;
            }
        }

        return false;
    }

    Game.prototype.getLastSelectedIndex = function (cards) {
        for (var i = cards.length - 1; i >= 0; i--) {
            if (cards[i].selected) {
                return i;
            }
        }

        return -1;
    }

    Game.prototype.choosePrompt = function (cards, lastCards) {
        var start = this.getLastSelectedIndex(cards) - 1;
        if (start < 0) {
            start = cards.length - 1;
        }
        this.unchooseAll(cards);
        var j = this.getCardType(lastCards);
        alert(j);
        for (var i = this.PutType.SINGLE; i < this.PutType.INVALID; i++) {
            if (this.rule[i][j] != 0) {
                if (this.chooseCard(cards, lastCards, start, i, this.rule[i][j] == 1 ? false : true)) {
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.removeSelectedCards = function (cards) {
        for (var i = cards.length - 1; i >= 0; i++) {
            if (cards[i].selected) { cards.splice(i, 1); }
        }
    }

    Game.prototype.getSelectedCards = function (cards) {
        var temp = new Array;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].selected) { temp.push(cards[i]); }
        }
        return temp;
    }

    Game.prototype.unchooseAll = function (cards) {
        for (var i = 0; i < cards.length; i++) {
            cards[i].selected = false;
        }
    }

    Game.prototype.chooseCard = function (cards, lastCards, start, searchType, bCompare) {
        switch (searchType) {
            case this.PutType.SINGLE:
                return this.chooseSingle(cards, lastCards, start, bCompare);
                break;
            case this.PutType.PAIR:
                return this.choosePair(cards, lastCards, start, bCompare);
                break;
            case this.PutType.PAIRS:
                return this.choosePairs(cards, lastCards, start, bCompare);
                break;
            case this.PutType.STRAIGHT:
                return this.chooseStraight(cards, lastCards, start, bCompare);
                break;
            case this.PutType.THREE_BOMB:
                return this.chooseThreeBomb(cards, lastCards, start, bCompare);
                break;
            case this.PutType.FOUR_BOMB:
                return this.chooseFourBomb(cards, lastCards, start, bCompare);
                break;
            case this.PutType.KING_BOMB:
                return this.chooseKingFourBomb(cards, lastCards, start, bCompare);
                break;
        }

        return false;
    }

    Game.prototype.chooseSingle = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[0])) {
                cards[j].selected = true;
                return true;
            }
        }

        return false;
    }

    Game.prototype.choosePair = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            if (j < 1) { continue; }
            if (cards[j].num == cards[j - 1].num) {
                if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[0])) {
                    cards[j].selected = true;
                    cards[j - 1].selected = true;
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.choosePairs = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            var temp = [];
            var index = j;
            var indices = [];
            do {
                while (index > 1 && cards[index].num == cards[index - 2].num) { index--; }
                temp.push(cards[index]);
                indices.push(index);
                temp.push(cards[index - 1]);
                indices.push(index - 1);
                index -= 2;
            }
            while (temp.length < lastCards.length && index > 0)

            if (temp.length < lastCards.length) { continue; }

            if (this.isPairs(temp)) {
                if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[lastCards.length - 1])) {
                    for (var m = 0; m < indices.length; m++) {
                        cards[indices[m]].selected = true;
                    }
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.chooseStraight = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            var temp = [];
            var index = j;
            var indices = [];
            do {
                while (index > 0 && cards[index].num == cards[index - 1].num) { index--; }
                temp.push(cards[index]);
                indices.push(index);
                index--;
            }
            while (temp.length < lastCards.length && index >= 0)

            if (temp.length < lastCards.length) { continue; }

            if (this.isStraight(temp)) {
                if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[lastCards.length - 1])) {
                    for (var m = 0; m < indices.length; m++) {
                        cards[indices[m]].selected = true;
                    }
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.chooseThreeBomb = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            if (j < 2) { continue; }
            if (cards[j].num == cards[j - 1].num && cards[j - 1].num == cards[j - 2].num) {
                if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[0])) {
                    cards[j].selected = true;
                    cards[j - 1].selected = true;
                    cards[j - 2].selected = true;
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.chooseFourBomb = function (cards, lastCards, start, bCompare) {
        for (var i = 0; i < cards.length; i++) {
            var j = (start - i) % (cards.length);
            if (j < 3) { continue; }
            if (cards[j].num != cards[j - 1].num ||
                cards[j - 1].num != cards[j - 2].num ||
                cards[j - 2].num != cards[j - 3].num) { continue; }

            if (!bCompare || this.getOrder(cards[j]) > this.getOrder(lastCards[0])) {
                for (var k = 0; k < 4; k++) { cards[j - k].selected = true; }
                return true;
            }
        }

        return false;
    }

    Game.prototype.chooseKingFourBomb = function (cards, lastCards, start, bCompare) {
        if (cards.length < 2 || cards[0].num != 14 || cards[1].num != 13) { return false; }

        cards[0].selected = true;
        cards[1].selected = true;
        return true;
    }

    var Card = function (suit, num, src) {
        this.suit = suit;
        this.num = num;
        this.src = src;

        this.selected = false;
    }
    Card.prototype.isEqual = function (cardB) {
        return (this.suit == cardB.suit && this.num == cardB.num);
    }

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

    var Rect = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    var Player = function (playerId, playerName) {
        this.id = playerId;
        this.name = playerName;

        this.cards = [];
        this.cardsNum;
        this.isRobot = false;

        this.score;

        this.socketId;

    };

    exports.Game = Game;
    exports.Card = Card;
    exports.Box = Box;
    exports.BottomBox = BottomBox;
    exports.Player = Player;

})(typeof global === "undefined" ? window : exports);
