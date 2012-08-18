

(function(exports) {

var Util = {
    isRectCross : function (x1, y1, w1, h1, x2, y2, w2, h2) {
        var b1 = Math.abs((2 * x1 + w1) - (2 * x2 + w2)) < (w1 + w2);
        var b2 = Math.abs((2 * y1 + h1) - (2 * y2 + h2)) < (h1 + h2);
        return b1 && b2;
    },
    guidGenerator : function() {
      var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
   pause : function(millseconds){
   	var dt = new Date();
   	while((new Date()) - dt <= millseconds){/*Do nothing*/}
   }
};

exports.Util = Util;
})(typeof global === "undefined" ? window : exports);