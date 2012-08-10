// Function related to card logic
function builddeck() {
    var n;
    var si;
    var suitnames = ["clubs", "hearts", "spades", "diamonds"];
    var picname;
    var nums = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + nums[n] + "-75.png";
            deck.push(new card(suitnames[si], nums[n], picname));
        }
    }

    deck.push(new card("", "joker-b", "img\\joker-b-75.png"));
    deck.push(new card("", "joker-r", "img\\joker-r-75.png"));
}

function shuffle() {
    var i = deck.length - 1;
    var s;
    while (i > 0) {
        s = Math.floor(Math.random() * (i + 1));
        swapindeck(s, i);
        i--;
    }
}

function swapindeck(j, k) {
    var temp = new card(deck[j].suit, deck[j].num, deck[j].picture.src);
    deck[j] = deck[k];
    deck[k] = temp;
}

function fillbox() {
    for (i = 0; i < 14; i++) {
        bb.cards.push(new card(deck[i].suit, deck[i].num, deck[i].picture.src));
    }
}

function buildImgSrcs() {
    var n;
    var si;
    var suitnames = ["clubs", "hearts", "spades", "diamonds"];
    var picname;
    var nums = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + nums[n] + "-75.png";
            imgSrcs.push(picname);
        }
    }
    
    imgSrcs.push("img\\joker-b-75.png");
    imgSrcs.push("img\\joker-r-75.png");
    imgSrcs.push("img\\back-blue-75-1.png");
    imgSrcs.push("img\\back-blue-h-75-1.png");
}

function compare(card1, card2) {
}

function sort(cards) {
    
}