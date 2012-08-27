(function (exports) {
    var Box = function (group) {
        this.cardsNum = 0;
        this.group = group;
    }

    var BottomBox = function (group) {
        this.cards = [];
        this.group = group;
    }

    Game.CARD_WIDTH = 75;
    Game.CARD_HEIGHT = 107;
    Game.CARD_SPACE = 18;     // space btw cards
    Game.CARD_EXTEND = 25;    // extend space when card is selected


    // init canvas
    Game.prototype.initCanvas = function() {

        this.canvasStage = new Kinetic.Stage({
          container: 'canvas',
          width: 980,
          height: 780
        });

        this.layer = new Kinetic.Layer();

        // left box
        var groupBox = new Kinetic.Group({
          x: 0,
          y: 150,
          id: 'leftBox'
        });
        var groupHandCardBox = new Kinetic.Group({
          x: 100,
          y: 10,
          id: 'handCardBox',
          name: 'handCardBox'
        });
        var groupAvatarBox = new Kinetic.Group({
          x: 0,
          y: 150,
          id: 'avatarBox',
          name: 'avatarBox'
        });
        var groupPutCardBox = new Kinetic.Group({
          x: 280,
          y: 160,
          id: 'putCardBox',
          name: 'putCardBox'
        });

        groupBox.add(groupHandCardBox);
        groupBox.add(groupPutCardBox);

        // init avatar box
        var avatar = new Kinetic.Image({
          image: Source.imgMap["img/gravatar-user.png"],
          x: 40,
          y: 0,
          width: 50,
          height:50,
          id: 'avatar',
          name: 'avatar'
        });
        var name = new Kinetic.Text({
          x: 0,
          y: 60,
          width: 130,
          height:50,
          text: 'mcfnmcmc',
          fontSize: 12,
          fontFamily: 'Calibri',
          textFill: '#555',
          padding: 0,
          align: 'center',
          id: 'name',
          name: 'name'
        });
        groupAvatarBox.add(avatar);
        groupAvatarBox.add(name);

        groupBox.add(groupAvatarBox);
        groupBox.add(groupPutCardBox);

        this.lb = new Box(groupBox);
        this.lob = groupPutCardBox;
        this.layer.add(groupBox);

        // right box
        var groupBox = new Kinetic.Group({
          x: 520,
          y: 150,
          id: 'rightBox'
        });
        var groupHandCardBox = new Kinetic.Group({
          x: 200,
          y: 10,
          id: 'handCardBox',
          name: 'handCardBox'
        });
        var groupAvatarBox = new Kinetic.Group({
          x: 310,
          y: 150,
          id: 'avatarBox',
          name: 'avatarBox'
        });
        var groupPutCardBox = new Kinetic.Group({
          x: 100,
          y: 160,
          id: 'putCardBox',
          name: 'putCardBox'
        });

        groupBox.add(groupHandCardBox);
        groupBox.add(groupPutCardBox);
        // avatar
        var avatar = new Kinetic.Image({
          image: Source.imgMap["img/gravatar-user.png"],
          x: 50,
          y: 0,
          width: 50,
          height:50,
          id: 'avatar',
          name: 'avatar'
        });
        var name = new Kinetic.Text({
          x: 0,
          y: 60,
          width: 150,
          height:50,
          text: 'mcfnmcmc',
          fontSize: 12,
          fontFamily: 'Calibri',
          textFill: '#555',
          padding: 0,
          align: 'center',
          id: 'name',
          name: 'name'
        });
        groupAvatarBox.add(avatar);
        groupAvatarBox.add(name);
        groupBox.add(groupAvatarBox);

        this.rb = new Box(groupBox);
        this.rob = groupPutCardBox;
        this.layer.add(groupBox);

        // top box
        var groupBox = new Kinetic.Group({
          x: 260,
          y: 0,
          id: 'topBox'
        });
        var groupHandCardBox = new Kinetic.Group({
          x: 100,
          y: 10,
          id: 'handCardBox',
          name: 'handCardBox'
        });
        var groupAvatarBox = new Kinetic.Group({
          x: 0,
          y: 0,
          id: 'avatarBox',
          name: 'avatarBox'
        });
        var groupPutCardBox = new Kinetic.Group({
          x: 150,
          y: 160,
          id: 'putCardBox',
          name: 'putCardBox'
        });
        groupBox.add(groupHandCardBox);
        groupBox.add(groupPutCardBox);


        // avatar
        var avatar = new Kinetic.Image({
          image: Source.imgMap["img/gravatar-user.png"],
          x: 30,
          y: 60,
          width: 50,
          height:50,
          id: 'avatar',
          name: 'avatar'
        });
        var name = new Kinetic.Text({
          x: 0,
          y: 120,
          width: 110,
          height:50,
          text: 'mcfnmcmc',
          fontSize: 12,
          fontFamily: 'Calibri',
          textFill: '#555',
          padding: 0,
          align: 'center',
          id: 'name',
          name: 'name'
        });
        groupAvatarBox.add(name);
        groupAvatarBox.add(avatar);
        groupBox.add(groupAvatarBox);

        this.tb = new Box(groupBox);
        this.tob = groupPutCardBox;
        this.layer.add(groupBox);

        // buttom box
        var groupBox = new Kinetic.Group({
          x: 260,
          y: 450,
          id: 'bottomBox'
        });
        var groupCardBox = new Kinetic.Group({
          x: 100,
          y: 10,
          id: 'cardBox',
          name: 'cardBox'
        });
        var groupAvatarBox = new Kinetic.Group({
          x: 0,
          y: 130,
          id: 'avatarBox',
          name: 'avatarBox'
        });

        groupBox.add(groupCardBox);
        // avatar
        var avatar = new Kinetic.Image({
          image: Source.imgMap["img/gravatar-user.png"],
          x: 30,
          y: 60,
          width: 50,
          height:50,
          id: 'avatar',
          name: 'avartar'
        });
        var name = new Kinetic.Text({
          x: 0,
          y: 120,
          width: 110,
          height:50,
          text: 'mcfnmcmc',
          fontSize: 12,
          fontFamily: 'Calibri',
          textFill: '#555',
          padding: 0,
          align: 'center',
          id: 'name',
          name: 'name'
        });

        groupAvatarBox.add(name);
        groupAvatarBox.add(avatar);
        groupBox.add(groupAvatarBox);

        this.bb = new BottomBox(groupBox);
        this.layer.add(groupBox);

        this.canvasStage.add(this.layer);
    }

    game = new Game();
    game.gameList = [];
    game.seatPos = [new Rect(30, 90, 60, 30), new Rect(90, 30, 30, 60),
                new Rect(30, 0, 60, 30), new Rect(0, 30, 30, 60)];

    game.tagName = ['#bb', '#rb', '#tb', '#lb'];
    game.StageType = {
        CHOOSE_GAME: 0,
        WAITING: 1,
        PLAYING: 2
    };

    game.stage = game.StageType.CHOOSE_GAME;
    game.myName = '';
    game.myRoom = -1;
    game.mySeat = -1;
    game.playersInRoom = 0;

    game.curPutterSeat = -1;

    ////////
    /// init game canvas
    ////////

    /// init left box
    game.canvasStage = false;
    game.layer = false;


    game.tb = false;
    game.lb = false;
    game.rb = false;
    game.bb = false;

    game.tob = false;
    game.lob = false;
    game.rob = false;
    game.bob = false;

    /*
    game.tn = new Rect(560, 30, 100, 20);
    game.ln = new Rect(40, 415, 100, 20);
    game.rn = new Rect(1080, 415, 100, 20);
    game.bn = new Rect(575, 860, 100, 20);

    game.tb = new Box(14, new Rect(300, 50, 600, Game.CARD_HEIGHT));
    game.lb = new Box(14, new Rect(150, 125, Game.CARD_HEIGHT, 600));
    game.rb = new Box(14, new Rect(930, 125, Game.CARD_HEIGHT, 600));
    game.bb = new BottomBox(new Rect(300, 700, 600, Game.CARD_HEIGHT + Game.CARD_EXTEND));

    game.tob = new OutBox(new Rect(300, 167, 600, Game.CARD_HEIGHT));
    game.lob = new OutBox(new Rect(267, 396, 326, Game.CARD_HEIGHT));
    game.rob = new OutBox(new Rect(594, 396, 326, Game.CARD_HEIGHT));
    game.bob = new OutBox(new Rect(300, 583, 600, Game.CARD_HEIGHT));
    */

    game.imgSrcs = new Array;

    // mouse down position
    game.startX = 0;
    game.startY = 0;

    game.buildImgSrcs = function () {
        var n;
        var si;
        var picname;
        for (var si = 0; si < 4; si++) {
            for (var n = 0; n < 13; n++) {
                picname = "img/" + this.suitnames[si] + "-" + this.cardNums[n] + "-75.png";
                this.imgSrcs.push(picname);
            }
        }
        this.imgSrcs.push("img/joker-b-75.png");
        this.imgSrcs.push("img/joker-r-75.png");
        this.imgSrcs.push("img/back-blue-75-1.png");
        this.imgSrcs.push("img/back-blue-h-75-1.png");
        this.imgSrcs.push("img/gravatar-user.png");
    }

    game.hold = function () {
        if (game.lastPutterSeat == game.mySeat) {
            smoke.signal('Can not hold, please choose cards to put!');
            return;
        }

        allowPut(false);
        socket.emit('Put', { room: this.myRoom, seat: this.mySeat,
            putCards: new Array,
            remainCards: this.bb.cards
        });
        renderer.drawBottomOutbox(new Array);
    };

    game.prompt = function () {
        this.choosePrompt(this.bb.cards, this.lastPutCards);
        renderer.drawBottomBox();
    };

    game.getSelectedCards = function() {
        var cardBox = this.bb.group.get('.cardBox')[0];
        var cards = cardBox.getChildren();
        var selectCards = [];
        var cardIdx = 0;
        for( var i in cards ) {
            if ( cards[i].selected == true && cards[i].isPut == false ) {
              this.bb.cards[cardIdx].selected = true;
              selectCards.push( this.bb.cards[cardIdx] );
              cardIdx++;
            }
        }

        return selectCards;
    };

    game.put = function ( isTimeOut ) {
        var selectedCards = this.getSelectedCards(this.bb.cards);

        // verify whether can put
        if ( this.isValidPut() == false) {
            smoke.signal('Invalid cards!');
            return;
        }

        allowPut(false);

        this.removeSelectedCards(this.bb.cards);

        renderer.putAnim();

        // send to server
        socket.emit('Put', { room: this.myRoom, seat: this.mySeat,
            putCards: selectedCards,
            remainCards: this.bb.cards,
        });

    }

    game.fillbox = function (players, isFillBottom) {
        if (isFillBottom) { this.bb.cards = players[this.mySeat].cards; }
        this.rb.cardsNum = players[(this.mySeat + 1) % 4].cardsNum;
        this.tb.cardsNum = players[(this.mySeat + 2) % 4].cardsNum;
        this.lb.cardsNum = players[(this.mySeat + 3) % 4].cardsNum;
    }

    game.enterRoom = function (room, seat, name) {
        game.myRoom = room;
        game.mySeat = seat;
        game.myName = name;
        socket.emit('EnterRoom', { room: room,
                                   seat: seat,
                                   playerName: name
                                  });
    }
    
    // check if select cards valid to put
    game.isValidPut = function() {
        var selectedCards = this.getSelectedCards(this.bb.cards);
        // verify whether can put
        return (game.compareCards(selectedCards, this.lastPutCards));
    }



    
    exports.game = game;
})(window);