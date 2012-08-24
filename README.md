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

Structure :

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



