// Utility function for common use

function isRectCross(x1, y1, w1, h1, x2, y2, w2, h2) {
    var b1 = Math.abs((2 * x1 + w1) - (2 * x2 + w2)) < (w1 + w2);
    var b2 = Math.abs((2 * y1 + h1) - (2 * y2 + h2)) < (h1 + h2);

    return b1 && b2;
}
