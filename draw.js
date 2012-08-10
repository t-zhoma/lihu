// Function for draw

function drawBox() {
    drawBottomBox();
    drawTopBox();
    drawLeftBox();
    drawRightBox();
}

function drawLeftBox() {
    var h = cardw + (lb.cardsNum - 1) * cardspace;
    if (lb.cardsNum == 0) {
        h += cardspace;
    }

    var x = leftboxx;
    var y = (leftboxh - h) / 2 + leftboxy;

    var img = new Image();
    img.src = "img\\back-blue-h-75-1.png";
    ctx.clearRect(leftboxx, leftboxy, leftboxw, leftboxh);
    for (i = 0; i < lb.cardsNum; i++) {
        ctx.drawImage(img, x, y, cardh, cardw);
        y += cardspace;
    }
}

function drawRightBox() {
    var h = cardw + (rb.cardsNum - 1) * cardspace;
    if (rb.cardsNum == 0) {
        h += cardspace;
    }

    var x = rightboxx;
    var y = (rightboxh - h) / 2 + rightboxy;

    var img = new Image();
    img.src = "img\\back-blue-h-75-1.png";
    ctx.clearRect(rightboxx, rightboxy, rightboxw, rightboxh);
    for (i = 0; i < rb.cardsNum; i++) {
        ctx.drawImage(img, x, y, cardh, cardw);
        y += cardspace;
    }
}

function drawTopBox() {
    var w = cardw + (tb.cardsNum - 1) * cardspace;
    if (tb.cardsNum == 0) {
        w += cardspace;
    }
    var x = (topboxw - w) / 2 + topboxx;
    var y = topboxy;

    var img = new Image();
    img.src = "img\\back-blue-75-1.png";
    ctx.clearRect(topboxx, topboxy, topboxw, topboxh);
    for (i = 0; i < tb.cardsNum; i++) {
        ctx.drawImage(img, x, y, cardw, cardh);
        x += cardspace;
    }
}

function drawBottomBox() {
    var w = cardw + (bb.cards.length - 1) * cardspace;
    if (bb.cards.length == 0) {
        w += cardspace;
    }
    var x = (bottomboxw - w) / 2 + bottomboxx;
    var y = bottomboxy;

    ctx.clearRect(bottomboxx, bottomboxy, bottomboxw, bottomboxh);
    for (i = 0; i < bb.cards.length; i++) {
        var realY = bb.cards[i].selected ? y : (y + cardextend);
        ctx.drawImage(bb.cards[i].picture, x, realY, cardw, cardh);
        bb.cards[i].x = x;
        bb.cards[i].y = realY;
        x += cardspace;
    }
}

function drawBottomOutbox(cards) {
    var w = cardw + (cards.length - 1) * cardspace;
    if (cards.length == 0) {
        w += cardspace;
    }
    var x = (bottomOutboxw - w) / 2 + bottomOutboxx;
    var y = bottomOutboxy;

    ctx.clearRect(bottomOutboxx, bottomOutboxy, bottomOutboxw, bottomOutboxh);
    for (i = 0; i < cards.length; i++) {
        ctx.drawImage(cards[i].picture, x, y, cardw, cardh);
        x += cardspace;
    }
}

function drawTopOutbox(cards) {
    var w = cardw + (cards.length - 1) * cardspace;
    if (cards.length == 0) {
        w += cardspace;
    }
    var x = (topOutboxw - w) / 2 + topOutboxx;
    var y = topOutboxy;

    ctx.clearRect(topOutboxx, topOutboxy, topOutboxw, topOutboxh);
    for (i = 0; i < cards.length; i++) {
        ctx.drawImage(cards[i].picture, x, y, cardw, cardh);
        x += cardspace;
    }
}

function drawLeftOutbox(cards) {
    var x = leftOutboxx;
    var y = leftOutboxy;

    ctx.clearRect(leftOutboxx, leftOutboxy, leftOutboxw, leftOutboxh);
    for (i = 0; i < cards.length; i++) {
        ctx.drawImage(cards[i].picture, x, y, cardw, cardh);
        x += cardspace;
    }
}

function drawRightOutbox(cards) {
    var w = cardw + (cards.length - 1) * cardspace;
    if (cards.length == 0) {
        w += cardspace;
    }
    var x = rightOutboxw - w + rightOutboxx;
    var y = rightOutboxy;

    ctx.clearRect(rightOutboxx, rightOutboxy, rightOutboxw, rightOutboxh);
    for (i = 0; i < cards.length; i++) {
        ctx.drawImage(cards[i].picture, x, y, cardw, cardh);
        x += cardspace;
    }
}