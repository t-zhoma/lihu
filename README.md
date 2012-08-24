# About Lihu
Lihu is a online multiplayer poke game. Detail rules you could check [lihu - help](http://lihu.herokuapp.com/help.htm)  

# Online demo
[lihu@heroku](http://lihu.herokuapp.com/)

# Install
Install [nodejs](http://nodejs.org/), add node dir to PATH, make sure command line works

# Run
To run the game, you should start server first

1. `cd PATH/lihu`  
2. install node_modules  
run command: `npm install`  
3. Start server  
Windows:  
`start_server.bat`    
Mac/Linux:  
`start_server.sh`  
visit http://localhost:8080/ for the local game.

# Game flow
1. visit url, localhsot or [lihu@heroku](http://lihu.herokuapp.com/)
2. Select game room  
You can see there are 10 rooms in the **Select room** page, each room have 4 seats, left,right,top,bottom. Click any of the seat, and on the popup dialog enter you nickname, then enter the room.  
If you have not enough users to start the game (we need four users), Please select the bottom seat, so you could start the game with 
robots we provide :)  
PS: **Only the bottom seat user could control the game start**  
3. Waiting game room  
You'll be waiting users here, and you can also talk to the users in the same room user the chat-nav-bar on the right side.  
The people sit on the **bottom seat** could start the game.  
4. Start Lihu.
Just play as normal poke games. Detail rules please goto [lihu - help](http://lihu.herokuapp.com/help.htm)  


# Structure

	-> app.js
		node js server side, handle request.
	-> client.js:

	-> controller.js:
		handle mouse, keyboard input event, bind event
	-> game.js:
		game logic and game data
	-> clientGame.js
		inherit from game.js, use on client side
	-> serverGame.js
		inherit from game.js, use on server side
	-> home.html:
		game page
	-> render.js:
		canvas draw
	-> sound.js:
		TODO.  sound manager
	-> utility.js:
		common function
	-> lib/
		some 3rd js lib
	-> css/

	-> img/
		image folder
	-> Ptocfile
		use for Heroku deployment



