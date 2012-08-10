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

var bottombox = function() {
    this.cards = [];
}

var tb = new box(14);
var lb = new box(14);
var rb = new box(14);
var bb = new bottombox();

function preloadImg() {
    buildImgSrcs();
    var imgPreloader = new ImagePreloader(imgSrcs, ImagePreloadCallback);
}

function ImagePreloadCallback(images, nLoaded) {
    if (nLoaded != imgSrcs.length) {
        alert("Only " + nLoaded + " of " + imgSrcs.length + " images load successful!");
        return;
    }

    init();
}

function init() {
    builddeck();
    shuffle();
    fillbox();
    sort(bb.cards);
    drawBox();
    
    //##
    //var btn = document.getElementsByTagName("button")[0];
//    var btn = document.getElementsByTagName("button")[0];
    //    btn.disabled = true;
    //$("#btnHold").attr("disabled", true);
    //alert(jQuery("#button").innerHTML);
}

function keyPress(code) {
	//use this function to get all the key strokes, the code can be the following:
    // right, left, up, down, a, b, c, ... , z, 1, 2, ... , 9,  (a space for space bar)
}

function recieve(msg) {
	//recieve messages from other clients in this function, to send messages use server.broadcast(msg)
	//note that you will also recieve the message you broadcasted
}

function mouseDown(x, y) {
    startX = x;
    startY = y;
}

function mouseUp(x, y) {
    var x1 = Math.min(startX, x);
    var y1 = Math.min(startY, y);
    var w1 = Math.abs(startX - x);
    var h1 = Math.abs(startY - y);

    for (i = bb.cards.length - 1; i >= 0; i--) {
        if (isRectCross(x1, y1, w1, h1, bb.cards[i].x, bb.cards[i].y, cardw, cardh)) {
            bb.cards[i].selected = !bb.cards[i].selected;
            if (bb.cards[i].x < x1 && x1 < bb.cards[i].x + cardspace) {
                break;
            }
        }
    }

    drawBottomBox();
}

function prompt() {
    alert("prompt");
}

function hold() {
    drawBottomOutbox(new Array);
}

function put() {
    var selectedCards = new Array;
    for (i = bb.cards.length - 1; i >= 0; i--) {
        if (bb.cards[i].selected) {
            selectedCards.push(bb.cards[i]);
            bb.cards.splice(i, 1);
        }
    }
    
    drawBottomBox();
    drawBottomOutbox(selectedCards);

    drawTopOutbox(selectedCards);
    drawLeftOutbox(selectedCards);
    drawRightOutbox(selectedCards);
}