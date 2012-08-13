To run the game, you should start server first
Windows:
run start_server.bat  
Mac/Linux:
1. Install nodejs on you pc first
2. cd to PATH/lihu
3. run command "node server/app.js"

Structure :
	
	-> client.js:

	-> controller.js:
		handle mouse, keyboard input event, bind event
	-> game.js:
		game logic and game data
	-> index.html:
		homepage
	-> render.js:
		canvas draw
	-> sound.js:
		TODO.  sound manager
	-> utility.js:
		common function
	-> lib:
		some 3rd js lib
	-> server:
		server side code
	-> img:
		image folder


