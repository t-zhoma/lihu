// Card
var cardw = 75;
var cardh = 107;
var cardspace = 18;     // space btw cards
var cardextend = 25;    // extend space when card is selected

// Box
var bottomboxx = 300;
var bottomboxy = 700;
var bottomboxw = 600;
var bottomboxh = cardh + cardextend;

var topboxx = 300;
var topboxy = 50;
var topboxw = 600;
var topboxh = cardh;

var leftboxx = 150;
var leftboxy = 125;
var leftboxw = cardh;
var leftboxh = 600;

var rightboxx = 930;
var rightboxy = 125;
var rightboxw = cardh;
var rightboxh = 600;

var bottomOutboxx = 300;
var bottomOutboxy = 583;
var bottomOutboxw = 600;
var bottomOutboxh = cardh;

var topOutboxx = 300;
var topOutboxy = 167;
var topOutboxw = 600;
var topOutboxh = cardh;

var leftOutboxx = 267;
var leftOutboxy = 396;
var leftOutboxw = 326;
var leftOutboxh = cardh;

var rightOutboxx = 594;
var rightOutboxy = 396;
var rightOutboxw = 326;
var rightOutboxh = cardh;

// Cards
var deck = [];
var imgSrcs = new Array;

var startX;
var startY;

var card = function (suit, num, picname) {
    this.suit = suit;
    this.num = num;
    this.picture = new Image();
    this.picture.src = picname;
    this.selected = false;
}

var box = function (cardsNum) {
    this.cardsNum = cardsNum;
}

var bottombox = function () {
    this.cards = [];
}

var tb = new box(14);
var lb = new box(14);
var rb = new box(14);
var bb = new bottombox();

var cardNums = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a", "2", "joker-b", "joker-r"];
var suitnames = ["clubs", "hearts", "spades", "diamonds"];
var cardOrder = new Object(); // Card order related to current level

var PutType = {
    SINGLE: 0,      // 单牌
    PAIR: 1,        // 对子
    PAIRS: 2,       // 连对（滚子）
    STRAIGHT: 3,    // 顺子
    BOMB: 4,        // 炸弹
    INVALID: 5      // 无效牌
};

// level
var level = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
var ourLevel = 0;
var theirLevel = 0;
var ourRound = true;