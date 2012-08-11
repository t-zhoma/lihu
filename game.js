
(function(exports) {

var Game = function () {

// Cards
this.deck = [];
this.imgSrcs = new Array;

this.startX;
this.startY;

this.tb = new Box(14);
this.lb = new Box(14);
this.rb = new Box(14);
this.bb = new BottomBox();

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

Game.prototype.start = function() {

};

Game.prototype.put = function () {
    // TODO
    var selectedCards = new Array;
    for (i = this.bb.cards.length - 1; i >= 0; i--) {
        if ( this.bb.cards[i].selected) {
            selectedCards.push( this.bb.cards[i]);
            this.bb.cards.splice(i, 1);
        }
    }
    
    renderer.drawBottomBox();
    renderer.drawBottomOutbox(selectedCards);

    renderer.drawTopOutbox(selectedCards);
    renderer.drawLeftOutbox(selectedCards);
    renderer.drawRightOutbox(selectedCards);

};

Game.prototype.hold = function() {
    // TODO
    render.drawBottomOutbox(new Array);
};

Game.prototype.prompt = function() {
    // TODO
    // alert( this.getCardType(lastCard));
};

// Global variable
Game.CARD_WIDTH = 75;
Game.CARD_HEIGHT = 107;
Game.CARD_SPACE = 18;     // space btw cards
Game.CARD_EXTEND = 25;    // extend space when card is selected

// Box
Game.bottomboxx = 300;
Game.bottomboxy = 700;
Game.bottomboxw = 600;
Game.bottomboxh = Game.CARD_HEIGHT + Game.CARD_EXTEND;

Game.topboxx = 300;
Game.topboxy = 50;
Game.topboxw = 600;
Game.topboxh = Game.CARD_HEIGHT;

Game.leftboxx = 150;
Game.leftboxy = 125;
Game.leftboxw = Game.CARD_HEIGHT;
Game.leftboxh = 600;

Game.rightboxx = 930;
Game.rightboxy = 125;
Game.rightboxw = Game.CARD_HEIGHT;
Game.rightboxh = 600;

Game.bottomOutboxx = 300;
Game.bottomOutboxy = 583;
Game.bottomOutboxw = 600;
Game.bottomOutboxh = Game.CARD_HEIGHT;

Game.topOutboxx = 300;
Game.topOutboxy = 167;
Game.topOutboxw = 600;
Game.topOutboxh = Game.CARD_HEIGHT;

Game.leftOutboxx = 267;
Game.leftOutboxy = 396;
Game.leftOutboxw = 326;
Game.leftOutboxh = Game.CARD_HEIGHT;

Game.rightOutboxx = 594;
Game.rightOutboxy = 396;
Game.rightOutboxw = 326;
Game.rightOutboxh = Game.CARD_HEIGHT;

Game.prototype.buildImgSrcs = function() {
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
Game.prototype.builddeck = function() {
    var n;
    var si;
    var picname;
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + this.suitnames[si] + "-" + this.cardNums[n] + "-75.png";
            this.deck.push(new Card( this.suitnames[si], n, picname));
        }
    }

    this.deck.push(new Card("", 13, "img\\joker-b-75.png"));     // joker-b
    this.deck.push(new Card("", 14, "img\\joker-r-75.png"));     // joker-r
}

Game.prototype.shuffle = function() {
    var i = this.deck.length - 1;
    var s;
    while (i > 0) {
        s = Math.floor(Math.random() * (i + 1));
        this.swapcard(this.deck, s, i);
        i--;
    }
}

Game.prototype.swapcard = function(cards, j, k) {
    var temp = new Card(cards[j].suit, cards[j].num, cards[j].picture.src);
    cards[j] = cards[k];
    cards[k] = temp;
}

Game.prototype.fillbox = function() {
    for (i = 0; i < 14; i++) {
        this.bb.cards.push(new Card(this.deck[i].suit, this.deck[i].num, this.deck[i].picture.src));
    }
}


// return true when card1 < card2, else return false
Game.prototype.compare = function(card1, card2) {
    return this.getOrder(card1) < getOrder(card2);
}

Game.prototype.getOrder = function(card) {
    return this.cardOrder[ this.cardFullName(card.suit, card.num)];
}

// Select sort(Desc)
Game.prototype.sort = function(cards) {
    var max;
    for (i = 0; i < cards.length - 1; i++) {
        max = i;
        for (j = i; j < cards.length; j++) {
            if ( this.getOrder(cards[j]) > this.getOrder(cards[max])) {
                max = j;
            }
        }
        this.swapcard(cards, i, max);
    }
}

Game.prototype.getCurrentLevel = function() {
    return this.ourRound ? this.ourLevel : this.theirLevel;
}

Game.prototype.cardFullName = function(suitname, num) {
    return suitname + " " + num;
}

Game.prototype.buildCardOrder = function() {
    var curLevel = this.getCurrentLevel();
    var suitnames = ["diamonds", "clubs", "spades", "hearts"];
    var i = 0;

    for (j = 0; j < curLevel; j++) {
        for (k = 0; k < suitnames.length; k++) {
            this.cardOrder[ this.cardFullName( suitnames[k], j)] = i++;
        }
    }

    for (j = curLevel + 1; j < this.level.length; j++) {
        for (k = 0; k < suitnames.length; k++) {
            this.cardOrder[ this.cardFullName( suitnames[k], j)] = i++;
        }
    }

    for (k = 0; k < suitnames.length; k++) {
        this.cardOrder[ this.cardFullName( suitnames[k], 12)] = i++; // "2"
    }

    for (k = 0; k < suitnames.length; k++) {
        this.cardOrder[ this.cardFullName(suitnames[k], curLevel)] = i++;
    }

    this.cardOrder[ this.cardFullName("", "13")] = i++; // joker-b
    this.cardOrder[ this.cardFullName("", "14")] = i++; // joker-r
}


Game.prototype.getCardType = function (cards) {
    sort(cards);
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
            else if ( this.isStraight(cards)) {
                return this.PutType.STRAIGHT;
            }
            break;
        case 4:
            if (cards[0].num == cards[1].num && cards[1].num == cards[2].num && cards[2].num == cards[3].num) {
                return this.PutType.BOMB;
            }
            else if ( this.isStraight(cards)) {
                return this.PutType.STRAIGHT;
            }
            break;
        default:
            if ( this.isPairs(cards)) {
                return this.PutType.PAIRS;
            }
            break;
    }

    return this.PutType.INVALID;
}

Game.prototype.isStraight = function(cards) {
    if(cards.length < 3 || this.containSpecialCard(cards)){
        return false;
    }
    
    this.sort(cards);

    for(i = 0; i < cards.length-1; i++) {
        if(cards[i].num != cards[i+1].num+1){
            return false;
        }
    }

    return true;
}

Game.prototype.isPairs = function(cards) {
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

Game.prototype.containSpecialCard = function(cards) {
    for(i = 0; i < cards.length; i++) {
        if(cards[i].num == this.getCurrentLevel() || cards[i].num == 12 || 
           cards[i].num == 13 || cards[i].num == 14) { // master, "2", "joker-b" or "joker-r"
            return true;
           }
    }

    return false;
}








var Card = function (suit, num, picname) {
    this.suit = suit;
    this.num = num;
    this.picture = new Image();
    this.picture.src = picname;
    this.selected = false;
}

var Box = function (cardsNum) {
    this.cardsNum = cardsNum;
}

var BottomBox = function () {
    this.cards = [];
}

exports.Game = Game;
exports.Card = Card;
exports.Box = Box;
exports.BottomBox = BottomBox;

})(window);