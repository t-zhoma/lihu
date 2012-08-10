To run the game, run start_server which will start the server and open browser in localhost:8080, if another player wants 
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

	-> server:
		this object has only one function, broadcast to send message to all the connected clients
		broadcast: use this function to send message to all the clients e.g. server.broadcast("hello") or
		server.broadcast({ name: "hamza" })
	-> recieve:
		you need to declare this function to recieve messages from any client, use it as follows:
		function recieve(msg) {
			// now use the msg to do interesting stuff
		}
	-> keyPress:
		you also need to declare this function, this function will be called when ever a key is pressed, use it as
		follows:
		function keyPress(code) {
			// the code can be "left", "right", "up", "down", "a", "b", ... ,"z" ,"1" , "2", ... ,"9", " "
		}
	-> intersection functions:
		they are the functions contained in intersection.js, you wont need them until you are in the middle of developing
		the game, check out that file for all the functions, more docs comming on the way in the tutorials

