// Global variable
var cardw = 75;
var cardh = 107;
var cardspace = 18;     // space btw cards
var cardextend = 25;    // extend space when card is selected

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

var deck = [];
var imgSrcs = new Array;

var startX;
var startY;

var level = ["3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
var ourLevel = 0;
var theirLevel = 0;
var ourRound = 1; // 