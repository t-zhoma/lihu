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
        swapcard(deck, s, i);
        i--;
    }
}

function swapcard(cards, j, k) {
    var temp = new card(cards[j].suit, cards[j].num, cards[j].picture.src);
    cards[j] = cards[k];
    cards[k] = temp;
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

// return true when card1 < card2, else return false
function compare(card1, card2) {
    return getOrder(card1) < getOrder(card2);
}

function getOrder(card) {
    return cardOrder[cardFullName(card.suit, card.num)];
}

// Select sort(Desc)
function sort(cards) {
    var max;
    for (i = 0; i < cards.length - 1; i++) {
        max = i;
        for (j = i; j < cards.length; j++) {
            if (getOrder(cards[j]) > getOrder(cards[max])) {
                max = j;
            }
        }
        swapcard(cards, i, max);
    }
}

function getCurrentLevel() {
    return ourRound ? ourLevel : theirLevel;
}

function cardFullName(suitname, num) {
    return suitname + " " + num;
}

function buildCardOrder() {
    var curLevel = getCurrentLevel();
    var suitnames = ["diamonds", "clubs", "spades", "hearts"];
    var i = 0;

    for (j = 0; j < curLevel; j++) {
        for (k = 0; k < suitnames.length; k++) {
            cardOrder[cardFullName(suitnames[k], level[j])] = i++;
        }
    }

    for (j = curLevel + 1; j < level.length; j++) {
        for (k = 0; k < suitnames.length; k++) {
            cardOrder[cardFullName(suitnames[k], level[j])] = i++;
        }
    }

    for (k = 0; k < suitnames.length; k++) {
        cardOrder[cardFullName(suitnames[k], "2")] = i++;
    }

    for (k = 0; k < suitnames.length; k++) {
        cardOrder[cardFullName(suitnames[k], level[curLevel])] = i++;
    }

    cardOrder[cardFullName("", "joker-b")] = i++;
    cardOrder[cardFullName("", "joker-r")] = i++;
}