(function (exports) {

    var CanvasRenderer = function () {
    
    };

    CanvasRenderer.prototype.drawBox = function () {
        this.drawBottomBox();
        this.drawTopBox();
        this.drawLeftBox();
        this.drawRightBox();
        game.layer.draw();
    };

    CanvasRenderer.prototype.emptyPutCards = function () {
        renderer.drawTopOutbox([]);
        renderer.drawRightOutbox([]);
        renderer.drawLeftOutbox([]);
        renderer.drawBottomOutbox([]);
    };

    CanvasRenderer.prototype.drawLeftBox = function () {
        var cardBox = game.lb.group.get('.handCardBox')[0];
        cardBox.removeChildren();
        if ( game.rb.cardsNum == 0 ) {
            return ;
        }
        var x = 20;
        var y = (350 - (game.lb.cardsNum - 1) * Game.CARD_SPACE - Game.CARD_WIDTH )/2;
        
        // cards
        for (var i = 0 ; i < game.lb.cardsNum; i++) {
            var card = new Kinetic.Image({
              image: Source.imgMap["img/back-blue-h-75-1.png"],
              x: x,
              y: y,
              width:Game.CARD_HEIGHT,
              height:Game.CARD_WIDTH
            });
            y = y + Game.CARD_SPACE;
            cardBox.add(card);
        }   

    }

    CanvasRenderer.prototype.drawRightBox = function () {
        var cardBox = game.rb.group.get('.handCardBox')[0];
        cardBox.removeChildren();
        if ( game.rb.cardsNum == 0 ) {
            return ;
        }
        var x = 20;
        var y = (350 - (game.rb.cardsNum - 1) * Game.CARD_SPACE - Game.CARD_WIDTH )/2;
        
        // cards
        for (var i = 0 ; i < game.rb.cardsNum; i++) {
            var card = new Kinetic.Image({
              image: Source.imgMap["img/back-blue-h-75-1.png"],
              x: x,
              y: y,
              width:Game.CARD_HEIGHT,
              height:Game.CARD_WIDTH
            });
            y = y + Game.CARD_SPACE;
            cardBox.add(card);
        }
    }

    CanvasRenderer.prototype.drawTopBox = function () {
        var cardBox = game.tb.group.get('.handCardBox')[0];
        cardBox.removeChildren();
        if ( game.rb.cardsNum == 0 ) {
            return ;
        }
        var x = (350 - (game.tb.cardsNum - 1) * Game.CARD_SPACE - Game.CARD_WIDTH )/2;
        var y = 30;
        // cards
        for (var i = 0 ; i < game.tb.cardsNum; i++) {
            var card = new Kinetic.Image({
              image: Source.imgMap["img/back-blue-75-1.png"],
              x: x,
              y: y,
              width:Game.CARD_WIDTH,
              height:Game.CARD_HEIGHT
            });
            x = x + Game.CARD_SPACE;
            cardBox.add(card);
        }
    }

    CanvasRenderer.prototype.drawBottomBox = function () {
        var cardBox = game.bb.group.get('.cardBox')[0];
        if ( game.bb.cards.length == 0 ) {
            // cardBox.removeChildren();
            return ;
        }
        var x = (350 - ( game.bb.cards.length - 1) * Game.CARD_SPACE - Game.CARD_WIDTH )/2;
        var y = 160;
        // cards
        for (var i = 0 ; i < game.bb.cards.length; i++) {
            var card = new Kinetic.Image({
                image: Source.imgMap[game.bb.cards[i].src],
                x: x,
                y: y,
                width:Game.CARD_WIDTH,
                height:Game.CARD_HEIGHT
            });
            card.selected = false;
            card.isPut = false;

            card.on('click' , function() {
                var newY ;
                if ( this.selected === false ) {
                  newY = y - Game.CARD_EXTEND;
                  this.selected = true;
                } else {
                  newY = y;
                  this.selected = false;
                }
                this.transitionTo({
                    y: newY,
                    duration: 0.2,
                    easing: 'strong-ease-out'
                });

            });
            x = x + Game.CARD_SPACE;
            cardBox.add(card);
            card.moveToTop();
        }
    }


    CanvasRenderer.prototype.drawBottomOutbox = function (cards) {
        /*
        this.ctx.clearRect(game.bob.rect.x, game.bob.rect.y, game.bob.rect.w, game.bob.rect.h);

        var w = Game.CARD_WIDTH + (cards.length - 1) * Game.CARD_SPACE;
        if (cards.length == 0) {
            w += Game.CARD_SPACE;
        }

        var x = (game.bob.rect.w - w) / 2 + game.bob.rect.x;
        var y = game.bob.rect.y;

        if (cards.length == 0) {
            this.ctx.fillText('Hold', x, y + Game.CARD_HEIGHT / 2);
            return;
        }

        for (i = 0; i < cards.length; i++) {
            this.ctx.drawImage(Source.imgMap[cards[i].src], x, y, Game.CARD_WIDTH, Game.CARD_HEIGHT);
            x += Game.CARD_SPACE;
        }
        */
    }

    CanvasRenderer.prototype.drawTopOutbox = function (cards) {
        var cardsNum = cards.length;
        var seatBox = game.tb.group;
        var putCardBox = seatBox.get('.putCardBox')[0];
        var handCardBox = seatBox.get('.handCardBox')[0];

        putCardBox.removeChildren();
        putCardBox.setX(0);
        putCardBox.setY(150);
        if ( cardsNum == 0 ) {
            // hold
            message = getPutMessage(200, 10, 'Hold');
            putCardBox.add( message );
        } else {
            var sX = (500 - (cardsNum - 1) * Game.CARD_SPACE - Game.CARD_WIDTH )/2 ;
            for (i = 0; i < cards.length; i++) {
              var card = new Kinetic.Image({
                  image: Source.imgMap[cards[i].src],
                  x: sX,
                  y: 0,
                  width:Game.CARD_WIDTH,
                  height:Game.CARD_HEIGHT
              });
              sX += Game.CARD_SPACE;
              putCardBox.add( card );
            }
        }
        
        game.layer.draw();
        putCardBox.transitionTo({
            y: putCardBox.getY() + 10 ,
            duration: 1,
            easing: 'strong-ease-out'
        });
    }

    CanvasRenderer.prototype.drawLeftOutbox = function (cards) {
        var cardsNum = cards.length;
        var seatBox = game.lb.group;
        var putCardBox = seatBox.get('.putCardBox')[0];
        var handCardBox = seatBox.get('.handCardBox')[0];

        putCardBox.removeChildren();
        putCardBox.setX(210);
        putCardBox.setY(160);
        if ( cardsNum == 0 ) {
            // hold
            message = getPutMessage(0, 20, 'Hold');
            putCardBox.add( message );
        } else {
            var sX = 0;

            for (i = 0; i < cards.length; i++) {
              var card = new Kinetic.Image({
                  image: Source.imgMap[cards[i].src],
                  x: sX,
                  y: 0,
                  width:Game.CARD_WIDTH,
                  height:Game.CARD_HEIGHT
              });
              sX += Game.CARD_SPACE;
              putCardBox.add( card );
            }
        }
        
        game.layer.draw();
        putCardBox.transitionTo({
            x: putCardBox.getX() + 30 ,
            duration: 1,
            easing: 'strong-ease-out'
        });
    }

    CanvasRenderer.prototype.drawRightOutbox = function (cards) {
        var cardsNum = cards.length;
        var seatBox = game.rb.group;
        var putCardBox = seatBox.get('.putCardBox')[0];
        var handCardBox = seatBox.get('.handCardBox')[0];

        putCardBox.removeChildren();
        putCardBox.setX(240 - (cardsNum -1)*Game.CARD_SPACE - Game.CARD_WIDTH );
        putCardBox.setY(160);
        if ( cardsNum == 0 ) {
            // hold
            message = getPutMessage(60, 20, 'Hold');
            putCardBox.add( message );
        } else {
            var sX = 0;

            for (i = 0; i < cards.length; i++) {
              var card = new Kinetic.Image({
                  image: Source.imgMap[cards[i].src],
                  x: sX,
                  y: 0,
                  width:Game.CARD_WIDTH,
                  height:Game.CARD_HEIGHT
              });
              sX += Game.CARD_SPACE;
              putCardBox.add( card );
            }
        }
        
        game.layer.draw();
        putCardBox.transitionTo({
            x: putCardBox.getX() - 30 ,
            duration: 1,
            easing: 'strong-ease-out'
        });
    }


    CanvasRenderer.prototype.drawPutCards = function (putterSeat, putCards) {
        // bb
        if (putterSeat == game.mySeat) { return; } // Already draw when put

        // rb
        if ((game.mySeat + 1) % 4 == putterSeat) {
            renderer.drawRightBox();
            renderer.drawRightOutbox(putCards);
        }

        // tb
        if ((game.mySeat + 2) % 4 == putterSeat) {
            renderer.drawTopBox();
            renderer.drawTopOutbox(putCards);
        }

        // lb
        if ((game.mySeat + 3) % 4 == putterSeat) {
            renderer.drawLeftBox();
            renderer.drawLeftOutbox(putCards);
        }
    }

    CanvasRenderer.prototype.updateWaitingPage = function (data) {
        $('#nav_bar #room_id').html(data.room);
        for (var i = 0; i < data.players.length; i++) {
            var player = data.players[i];
            var name = player == null ? '' : player.name;
            $('#waiting ' + game.tagName[i]).html(name);
        }
    }

    CanvasRenderer.prototype.drawGameList = function () {

        var roomHtml = '';

        for (var i = 0; i < game.gameList.length; i++) {
            // Room
            var players = game.gameList[i];
            roomHtml += "<div class='room-item fl'>" +
                        "<div class='room-name'>Room " + i + "</div>" +
                        "<table>" +
                        "   <tr>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='2' room ='" + i + "' >" + (players[2] == null ? "" : players[2].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "    </tr>" +
                        "    <tr>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='3' room ='" + i + "' >" + (players[3] == null ? "" : players[3].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='1' room ='" + i + "' >" + (players[1] == null ? "" : players[1].name) + "</div>" +
                        "        </td>" +
                        "    </tr>" +
                        "    <tr>" +
                        "        <td></td>" +
                        "        <td>" +
                        "            <div class='seat btn btn-primary' seat ='0' room ='" + i + "' >" + (players[0] == null ? "" : players[0].name) + "</div>" +
                        "        </td>" +
                        "        <td></td>" +
                        "    </tr>" +
                        "</table>" +
                    "</div>";
        }

        roomHtml += "<div class='clr'></div>";
        $('#room_list').html(roomHtml);


        $('#room_list .seat').click(function () {
            var name = $(this).html();
            var seat = $(this).attr('seat');
            var room = $(this).attr('room')

            if (name != '') {
                smoke.alert('This seat already have player!');
            }
            else if (game.myName != '') {
                name = game.myName;
                game.enterRoom(parseInt(room), parseInt(seat), name);
            }
            else {
                smoke.prompt("what is your name", function (name) {
                    
                    if ( !name || $.trim(name) == '') { 
                        smoke.signal('sorry, name required');
                    } else if ( $.trim(name).length > 8) {
                        smoke.signal('name length must less than 10');
                    } else {
                        game.enterRoom(parseInt(room), parseInt(seat), $.trim(name));
                    } 
                });
            }
        });

    }

    CanvasRenderer.prototype.clear = function () {
        game.initCanvas();
    }

    CanvasRenderer.prototype.drawRank = function (seat, rank) {
        var font = '30px Arial';
        var fillStyle = 'red';

        // bb
        if (seat == game.mySeat) {
            this.fillTextCenter('第' + rank + '名', game.bb.rect.x, game.bb.rect.y, game.bb.rect.w, game.bb.rect.h, font, fillStyle);
        }

        // rb
        if ((game.mySeat + 1) % 4 == seat) {
            this.fillTextCenter('第' + rank + '名', game.rb.rect.x, game.rb.rect.y, game.rb.rect.w, game.rb.rect.h, font, fillStyle);
        }

        // tb
        if ((game.mySeat + 2) % 4 == seat) {
            this.fillTextCenter('第' + rank + '名', game.tb.rect.x, game.tb.rect.y, game.tb.rect.w, game.tb.rect.h, font, fillStyle);
        }

        // lb
        if ((game.mySeat + 3) % 4 == seat) {
            this.fillTextCenter('第' + rank + '名', game.lb.rect.x, game.lb.rect.y, game.lb.rect.w, game.lb.rect.h, font, fillStyle);
        }
    }

    CanvasRenderer.prototype.fillTextCenter = function (text, x, y, w, h, font, fillStyle) {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = 'center';
        var metrics = this.ctx.measureText(text);
        var xReal = x + w / 2;
        var yReal = y + h / 2 + 10;
        this.ctx.fillText(text, xReal, yReal);
        this.ctx.textAlign = 'start';
    }

    CanvasRenderer.prototype.drawCountDown = function (num) {
        var num = $('#count_down #count_down_num').html();
        if ( isNaN(num)  || ( parseInt(num) - 1 <= 0) ) {
            // disable button
            $('#btnHold').attr('disabled', true);
            $('#btnPrompt').attr('disabled', true);
            $('#btnPut').attr('disabled', true);

            clearInterval(putInt);
            $('#count_down').fadeOut('slow');

            if ( game.curPutterSeat != game.mySeat ) {
                return;
            }

            // promote
            game.prompt();
            if ( game.isValidPut() == false) {
                game.hold();
            } else {
                game.put();
            }
            return ;
        } 
        $('#count_down #count_down_num').html( parseInt(num) - 1 );
    }

    // put cards animation
    CanvasRenderer.prototype.putAnim = function() {
        var seatBox = game.bb.group;
        var cardBox = seatBox.get('.cardBox')[0];
          var cards = cardBox.getChildren();
          var selectCards = [];
          var handCards = [];

          for( var i in cards ) {
            if ( cards[i].isPut === true ) {
              cards[i].hide();
              cardBox.remove(cards[i]); // remove putted cards
            }
          }
          for( var i in cards ) {
            if ( cards[i].isPut === true ) {
              continue;
            } else {
              if ( cards[i].selected === true  ) {
                selectCards.push( cards[i] );
              } else {
                handCards.push( cards[i] );
              }
            }
            
          }

          // put animation
          if ( selectCards.length > 0 ) {
            var putW = ( selectCards.length - 1 ) * Game.CARD_SPACE + Game.CARD_WIDTH;
            var sX = ( 300 - putW )/2;
            for( var i in selectCards ) {
              var card = selectCards[i];
              card.off('click');
              card.transitionTo({
                x: sX,
                y:  160 - Game.CARD_EXTEND - 10 - Game.CARD_HEIGHT,
                duration: 0.5,
                easing: 'strong-ease-out'
              });
              card.isPut = true;
              sX += Game.CARD_SPACE;
            }
          }
          
          // fold animation
          if ( handCards.length > 0 ) {
            var putW = ( handCards.length - 1 ) * Game.CARD_SPACE + Game.CARD_WIDTH;
            var sX = ( 300 - putW )/2;
            for( var i in handCards ) {
              var card = handCards[i];
              card.transitionTo({
                x: sX,
                y: card.getY(),
                duration: 0.5,
                easing: 'strong-ease-out'
              });
              sX += Game.CARD_SPACE;
            }
          }
    }

    function getPutMessage(x, y, msg) {
        return message = new Kinetic.Text({
          x: x,
          y: y,
          width: 100,
          height:50,
          text: msg,
          fontSize: 30,
          fontFamily: 'Calibri',
          textFill: 'red',
          padding: 0,
          align: 'center',
          id: 'message',
          name: 'message'
        });
    }

    // TODO
    // for cache & preload 
    var Source = {
        imgMap: false,
        getImg: function (src) {
            console.log(Source.imgMap);
            if (Source.imgMap == false) return false;
            return Source.imgMap[src];
        }
    };


    exports.Source = Source;
    exports.Renderer = CanvasRenderer;
})(window);