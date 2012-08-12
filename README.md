<<<<<<< HEAD
To run the game, you should start server first   
Windows:   
run start_server.bat    
Mac/Linux:   
1. Install nodejs on you pc first   
2. cd to ~/funnypoke   
3. run command "node server/app.js"   
   

after start the server, you can open browser in localhost:8080, if another player wants 
to join in then go to the <server computer name or ip>:8080. If server functionality is not required (for development)
then just start index.html in the browser.

Here is a quick introduction to the simple framework I created to help you build multiplayer games more easily. Note tthat this is a very early demo and will change till the final tutorial. So here is a quick introduction on how to use it:
The only file you have to edit to start writing games is teh client.js file in the root of the folder. Inside the client.js you have the following functions to help you into building a game:

	-> canvas:
		canvas is an object with overall information about the drawing area, you wont really need it though,
	-> width:
		this is the width of the drawing area
	-> height:
		this is the number with height of the drawing area
	-> ctx:
		ctx is an object to draw this on the screen, here are some of the most used functions inside it:

			ctx.fillStyle: use this to set the body color for future drawings, you can set a popular color or an rgba
				e.g. ctx.fillStyle = "blue" or ctx.fillStyle = "rgb(0, 0, 100)" etc

			ctx.strokeStyle: use this to set the borders of the future drawings, e.g. ctx.strokeStyle = "green"

			ctx.fillRect(x, y, width, height): this is a function to draw rectangle with only the fill,
			first you give the x and y coordionate of the rectange, then the width and the height of the rectange,
			the x starts from left to right and y from top to bottom. Its body color will be the color you set
			in ctx.fillStyle e.g. ctx.fillRect(0, 0, 50, 60) will create a rectangle in the top left corner with
			width 50 and height 60 i.e. from (0,0) to (50, 60)

			ctx.strokeRect(x, y, width, height): this will create a rectange like fillRect but will only draw its
			borders with the color set in ctx.strokeStyle

			There are many more functions available, to learn more about them go to the following urls:
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Drawing_shapes
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Using_images
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Applying_styles_and_colors
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Transformations
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Compositing
				-> https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Basic_animations

			And here is a cheat sheet:
				-> http://simon.html5.org/dump/html5-canvas-cheat-sheet.html

=======
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
>>>>>>> 9733893f674e1c58948a03018fd5224fb42a607e
	-> server:
		server side code
	-> img:
		image folder


