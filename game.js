
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
            BOMB: 4,        // 炸弹
            INVALID: 5      // 无效牌
        };

        // level
        this.level = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
        this.ourLevel = 0;
        this.theirLevel = 0;
        this.ourRound = true;

    };

    Game.prototype.start = function () {

    };

    Game.prototype.put = function () {
        // TODO
        var selectedCards = new Array;
        for (i = this.bb.cards.length - 1; i >= 0; i--) {
            if (this.bb.cards[i].selected) {
                selectedCards.push(this.bb.cards[i]);
                this.bb.cards.splice(i, 1);
            }
        }

        this.sort(selectedCards);

        renderer.drawBottomBox();
        renderer.drawBottomOutbox(selectedCards);

        renderer.drawTopOutbox(selectedCards);
        renderer.drawLeftOutbox(selectedCards);
        renderer.drawRightOutbox(selectedCards);

    };

    Game.prototype.hold = function () {
        // TODO
        render.drawBottomOutbox(new Array);
    };

    Game.prototype.prompt = function () {
        // TODO
        var lastCard = [new Card(this.suitnames[0], 5, null)]; // "8"
        this.choosePrompt(this.bb.cards, lastCard);
        renderer.drawBottomBox();
        // alert( this.getCardType(lastCard));
    };

    Game.prototype.buildImgSrcs = function () {
        var n;
        var si;
        var picname;
        for (si = 0; si < 4; si++) {
            for (n = 0; n < 13; n++) {
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
        for (si = 0; si < 4; si++) {
            for (n = 0; n < 13; n++) {
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
    }

    Game.prototype.swapcard = function (cards, j, k) {
        var temp = new Card(cards[j].suit, cards[j].num, cards[j].src);
        cards[j] = cards[k];
        cards[k] = temp;
    }

    Game.prototype.fillbox = function () {
        for (i = 0; i < 14; i++) {
            this.bb.cards.push(new Card(this.deck[i].suit, this.deck[i].num, this.deck[i].src));
        }
    }


    // return true when card1 < card2, else return false
    Game.prototype.compare = function (card1, card2) {
        return this.getOrder(card1) < getOrder(card2);
    }

    Game.prototype.getOrder = function (card) {
        return this.cardOrder[this.cardFullName(card.suit, card.num)];
    }

    // Select sort(Desc)
    Game.prototype.sort = function (cards) {
        var max;
        for (i = 0; i < cards.length - 1; i++) {
            max = i;
            for (j = i; j < cards.length; j++) {
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

        for (j = 0; j < curLevel; j++) {
            for (k = 0; k < suitnames.length; k++) {
                this.cardOrder[this.cardFullName(suitnames[k], j)] = i++;
            }
        }

        for (j = curLevel + 1; j < this.level.length; j++) {
            for (k = 0; k < suitnames.length; k++) {
                this.cardOrder[this.cardFullName(suitnames[k], j)] = i++;
            }
        }

        for (k = 0; k < suitnames.length; k++) {
            this.cardOrder[this.cardFullName(suitnames[k], 12)] = i++; // "2"
        }

        for (k = 0; k < suitnames.length; k++) {
            this.cardOrder[this.cardFullName(suitnames[k], curLevel)] = i++;
        }

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
                    return this.PutType.BOMB;
                }
                else if (cards[0].num == cards[1].num) {
                    return this.PutType.PAIR;
                }
                break;
            case 3:
                if (cards[0].num == cards[1].num && cards[1].num == cards[2].num) {
                    return this.PutType.BOMB;
                }
                else if (this.isStraight(cards)) {
                    return this.PutType.STRAIGHT;
                }
                break;
            case 4:
                if (cards[0].num == cards[1].num && cards[1].num == cards[2].num && cards[2].num == cards[3].num) {
                    return this.PutType.BOMB;
                }
                else if (this.isStraight(cards)) {
                    return this.PutType.STRAIGHT;
                }
                break;
            default:
                if (this.isPairs(cards)) {
                    return this.PutType.PAIRS;
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

        for (i = 0; i < cards.length - 1; i++) {
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
        for (i = 0; i < cards.length - 3; i = i + 2) {
            if (cards[i].num != cards[i + 1].num || cards[i].num != cards[i + 2].num + 1 ||
           cards[i].num != cards[i + 3].num + 1) {
                return false;
            }
        }

        return true;
    }

    Game.prototype.containSpecialCard = function (cards) {
        for (i = 0; i < cards.length; i++) {
            if (cards[i].num == this.getCurrentLevel() || cards[i].num == 12 ||
           cards[i].num == 13 || cards[i].num == 14) { // master, "2", "joker-b" or "joker-r"
                return true;
            }
        }

        return false;
    }

    Game.prototype.getLastSelectedIndex = function (cards) {
        for (i = cards.length - 1; i >= 0; i--) {
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
        switch (this.getCardType(lastCards)) {
            case this.PutType.SINGLE:
                if (!this.chooseSingle(cards, lastCards, start) && start != cards.length - 1) {
                    this.chooseSingle(cards, lastCards, cards.length - 1);
                }
                break;
            case this.PutType.PAIR:
                break;
            case this.PutType.PAIRS:
                break;
            case this.PutType.STRAIGHT:
                break;
            case this.PutType.BOMB:
                break;
        }
    }

    Game.prototype.unchooseAll = function (cards) {
        for (i = 0; i < cards.length; i++) {
            cards[i].selected = false;
        }
    }

    Game.prototype.chooseSingle = function (cards, lastCards, start) {
        for (i = start; i >= 0; i--) {
            if (this.getOrder(cards[i]) > this.getOrder(lastCards[0])) {

                cards[i].selected = true;
                return true;
            }
        }

        return false;
    }

    var Card = function (suit, num, src) {
        this.suit = suit;
        this.num = num;
        this.src = src;

        this.selected = false;
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

    exports.Game = Game;
    exports.Card = Card;
    exports.Box = Box;
    exports.BottomBox = BottomBox;

})(window);