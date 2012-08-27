
(function (exports) {

    ////////////////////////////
    // Common
    ////////////////////////////
    var Game = function () {
        // Cards
        this.cardNums = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a", "2", "joker-b", "joker-r"];
        this.suitnames = ["clubs", "hearts", "spades", "diamonds"];
        this.cardOrder = new Object(); // Card order related to current level

        this.PutType = {
            NONE: 0,        // 无
            SINGLE: 1,      // 单牌
            PAIR: 2,        // 对牌
            PAIRS: 3,       // 双顺（滚子）
            STRAIGHT: 4,    // 顺子
            THREE_BOMB: 5,  // 小炸弹（三张牌）
            FOUR_BOMB: 6,   // 大炸弹（四张牌）
            KING_BOMB: 7,   // 火箭（大小王）
            INVALID: 8      // 无效牌
        };

        // rule[i][j] means whether PutType i > j
        // 0: No, i.e. rule[PutType.SINGLE][PutType.KING_BOMB]
        // 1: Yes, i.e. rule[PutType.KING_BOMB][PutType.SINGLE]
        // 2: Maybe, i.e. rule[PutType.SINGLE][[PutType.SINGLE]]
        this.rule = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [1, 2, 0, 0, 0, 0, 0, 0, 0],
                     [1, 0, 2, 0, 0, 0, 0, 0, 0],
                     [1, 0, 0, 2, 0, 0, 0, 0, 0],
                     [1, 0, 0, 0, 2, 0, 0, 0, 0],
                     [1, 1, 1, 0, 1, 2, 0, 0, 0],
                     [1, 1, 1, 1, 1, 1, 2, 0, 0],
                     [1, 1, 1, 1, 1, 1, 1, 0, 0],
                     [0, 0, 0, 0, 0, 0, 0, 0, 0]];

        // level
        this.level = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
        this.level_0_2 = 0;
        this.level_1_3 = 0;
        this.isLevel_0_2 = true;

        // last put info
        this.lastPutterSeat = 0;
        this.lastPutCards = [];

        this.chatMsg = [];
    };

    Game.prototype.nextSeat = function (seat) {
        return (seat + 1) % 4;
    }

    Game.prototype.swapcard = function (cards, j, k) {
        var temp = new Card(cards[j].suit, cards[j].num, cards[j].src);
        temp.selected = cards[j].selected;
        cards[j] = cards[k];
        cards[k] = temp;
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

    // return true when card1 < card2, else return false, need buildCardOrder first
    Game.prototype.compare = function (card1, card2) {
        return this.getOrder(card1) < getOrder(card2);
    }

    Game.prototype.getOrder = function (card) {
        return this.cardOrder[this.cardFullName(card.suit, card.num)];
    }

    Game.prototype.getCurrentLevel = function () {
        return this.isLevel_0_2 ? this.level_0_2 : this.level_1_3;
    }

    Game.prototype.addLevel = function (isAddTo0_2, levels) {
        this.isLevel_0_2 = isAddTo0_2;
        isAddTo0_2 ? (this.level_0_2 = Math.min(this.level_0_2 + levels, 11)) :
                     (this.level_1_3 = Math.min(this.level_1_3 + levels, 11))
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
        if (cards == null || cards == undefined)
            return this.PutType.NONE;

        this.sort(cards);
        switch (cards.length) {
            case 0:
                return this.PutType.NONE;
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

        for (var i = this.PutType.NONE; i < this.PutType.INVALID; i++) {
            if (this.rule[i][j] != 0) {
                if (this.chooseCard(cards, lastCards, start, i, this.rule[i][j] == 1 ? false : true)) {
                    return true;
                }
            }
        }

        return false;
    }

    Game.prototype.removeSelectedCards = function (cards) {
        for (var i = cards.length - 1; i >= 0; i--) {
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

    // whether cards1 > cards2
    Game.prototype.compareCards = function (cards1, cards2) {
        var type1 = this.getCardType(cards1);
        var type2 = this.getCardType(cards2);

        switch (this.rule[type1][type2]) {
            case 0:
                return false;
            case 1:
                return true;
            case 2:
                {
                    switch (type1) {
                        case this.PutType.SINGLE:
                        case this.PutType.PAIR:
                        case this.PutType.THREE_BOMB:
                        case this.PutType.FOUR_BOMB:
                            return this.getOrder(cards1[0]) > this.getOrder(cards2[0]);
                        case this.PutType.PAIRS:
                        case this.PutType.STRAIGHT:
                            {
                                if (cards1.length != cards2.length) { return false; }
                                return this.getOrder(cards1[0]) > this.getOrder(cards2[0]);
                            }
                            break;
                    }
                }
                break;
        }

        return false;
    }

    ////////////////////////////
    // Data Type
    ////////////////////////////

    var Card = function (suit, num, src) {
        this.suit = suit;
        this.num = num;
        this.src = src;

        this.selected = false;
    }
    Card.prototype.isEqual = function (cardB) {
        return (this.suit == cardB.suit && this.num == cardB.num);
    }

    var Rect = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.contain = function (x, y) {
            return this.x < x && x < this.x + this.w &&
                                                this.y < y && y < this.y + this.h;
        }
    }

    var Player = function (playerName) {
        this.name = playerName;
        this.cards = [];
        this.cardsNum = 0;
        this.isRobot = false;
        this.socketId = false;
        this.isLihu = false;
    };

    Player.prototype.clone = function () {
        var temp = new Player(this.name);
        temp.cardsNum = this.cardsNum;
        temp.isRobot = this.isRobot;
        temp.socketId = this.socketId;
        temp.isLihu = this.isLihu;
        temp.cards = [];
        for (var i = 0; i < this.cards.length; i++) {
            temp.cards[i] = new Card(this.cards[i].suit, this.cards[i].num, this.cards[i].src);
        }
        return temp;
    }

    exports.Game = Game;
    exports.Card = Card;
    exports.Player = Player;
    exports.Rect = Rect;

})(typeof global === "undefined" ? window : exports);
    