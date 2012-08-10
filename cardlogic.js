// Function related to card logic
function builddeck() {
    var n;
    var si;
    var picname;
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + cardNums[n] + "-75.png";
            deck.push(new card(suitnames[si], n, picname));
        }
    }

    deck.push(new card("", 13, "img\\joker-b-75.png"));     // joker-b
    deck.push(new card("", 14, "img\\joker-r-75.png"));     // joker-r
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
    var picname;
    for (si = 0; si < 4; si++) {
        for (n = 0; n < 13; n++) {
            picname = "img\\" + suitnames[si] + "-" + cardNums[n] + "-75.png";
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
            cardOrder[cardFullName(suitnames[k], j)] = i++;
        }
    }

    for (j = curLevel + 1; j < level.length; j++) {
        for (k = 0; k < suitnames.length; k++) {
            cardOrder[cardFullName(suitnames[k], j)] = i++;
        }
    }

    for (k = 0; k < suitnames.length; k++) {
        cardOrder[cardFullName(suitnames[k], 12)] = i++; // "2"
    }

    for (k = 0; k < suitnames.length; k++) {
        cardOrder[cardFullName(suitnames[k], curLevel)] = i++;
    }

    cardOrder[cardFullName("", "13")] = i++; // joker-b
    cardOrder[cardFullName("", "14")] = i++; // joker-r
}

function getCardType(cards) {
    sort(cards);
    switch (cards.length) {
        case 1:
            return PutType.SINGLE;
        case 2:
            if ((cards[0].num == 14 && cards[1].num == 13)) { // "joker-r" and "joker-b"
                return PutType.BOMB;
            }
            else if (cards[0].num == cards[1].num) {
                return PutType.PAIR;
            }
            break;
        case 3:
            if (cards[0].num == cards[1].num && cards[1].num == cards[2].num) {
                return PutType.BOMB;
            }
            else if (isStraight(cards)) {
                return PutType.STRAIGHT;
            }
            break;
        case 4:
            if (cards[0].num == cards[1].num && cards[1].num == cards[2].num && cards[2].num == cards[3].num) {
                return PutType.BOMB;
            }
            else if (isStraight(cards)) {
                return PutType.STRAIGHT;
            }
            break;
        default:
            if (isPairs(cards)) {
                return PutType.PAIRS;
            }
            break;
    }

    return PutType.INVALID;
}

function isStraight(cards) {
    if(cards.length < 3 || containSpecialCard(cards)){
        return false;
    }
    
    sort(cards);

    for(i = 0; i < cards.length-1; i++) {
        if(cards[i].num != cards[i+1].num+1){
            return false;
        }
    }

    return true;
}

function isPairs(cards) {
    if (cards.length < 6 || cards.length % 2 == 1 || containSpecialCard(cards))
        return false;

    sort(cards);
    for (i = 0; i < cards.length - 3; i = i + 2) {
        if (cards[i].num != cards[i + 1].num || cards[i].num != cards[i + 2].num + 1 ||
           cards[i].num != cards[i + 3].num + 1) {
            return false;
        }
    }
    
    return true;
}

function containSpecialCard(cards) {
    for(i = 0; i < cards.length; i++) {
        if(cards[i].num == getCurrentLevel() || cards[i].num == 12 || 
           cards[i].num == 13 || cards[i].num == 14) { // master, "2", "joker-b" or "joker-r"
            return true;
           }
    }

    return false;
}