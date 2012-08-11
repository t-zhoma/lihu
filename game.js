
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

this.cardOrder = new Object(); // Card order related to current level

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
    alert('promote');
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
    var suitnames = ["clubs", "hearts", "spades", "diamonds"];
    var picname;
    var nums = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + nums[n] + "-75.png";
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
    var suitnames = ["clubs", "hearts", "spades", "diamonds"];
    var picname;
    var nums = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + nums[n] + "-75.png";
            this.deck.push(new Card(suitnames[si], nums[n], picname));
        }
    }

    this.deck.push(new Card("", "joker-b", "img\\joker-b-75.png"));
    this.deck.push(new Card("", "joker-r", "img\\joker-r-75.png"));
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
            this.cardOrder[ this.cardFullName(suitnames[k], this.level[j])] = i++;
        }
    }

    for (j = curLevel + 1; j < this.level.length; j++) {
        for (k = 0; k < suitnames.length; k++) {
            this.cardOrder[ this.cardFullName(suitnames[k], this.level[j])] = i++;
        }
    }

    for (k = 0; k < suitnames.length; k++) {
        this.cardOrder[ this.cardFullName(suitnames[k], "2")] = i++;
    }

    for (k = 0; k < suitnames.length; k++) {
        this.cardOrder[ this.cardFullName(suitnames[k], this.level[curLevel])] = i++;
    }

    this.cardOrder[ this.cardFullName("", "joker-b")] = i++;
    this.cardOrder[ this.cardFullName("", "joker-r")] = i++;
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