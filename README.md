# About Lihu
Lihu is a online multiplayer poke game. Detail rules you could check [lihu - help](http://lihu.herokuapp.com/help.htm)  


# Online demo
[lihu@heroku](http://lihu.herokuapp.com/)  
Support: IE9+, Chrome, Firefox


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
Just play as normal poke games. 
Detail rules please goto [lihu - help](http://lihu.herokuapp.com/help.htm)  
Enjoy it. :)

# 游戏指南  
1. 游戏地址 [lihu@heroku](http://lihu.herokuapp.com/)  (支持 IE9+,Chrome, Firefox, Safari)  
2. 选择房间      
有10个房间，每个房间有四个座位，上下左右。点击任何一个座位，在弹出框中填写你的nickname，即可进入游戏。  
该游戏需要四个人，如果凑不够游戏人数，请选择“下方”的座位（“下方”的座位控制游戏的开始），选择开始游戏后，系统会提供相应数量的机器人玩家以使游戏正常开始。  
3. 房间等待   
当进入房间，游戏尚未开始时候，你可以在房间内等待其它玩家。右侧侧边栏有简易聊天功能，可以和当前房间的其它玩家进行交流。   
坐在“下”座位的玩家可以选择游戏开始   
4. 开始游戏.     
像一般扑克游戏一样。详细规则可以查看[lihu - help](http://lihu.herokuapp.com/help.htm)  


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

# Heroku deployment guide   

1. https://devcenter.heroku.com/articles/quickstart  
Register and configure heroku at you PC.  
Ask the Heroku project owner add your email to the **Collaborators** list, or create the project your self.  

2. Import you SSH keys, this support git push to heroku  
https://devcenter.heroku.com/articles/keys  

3. Cd to PATH/lihu/  
`git remote add heroku git@heroku.com:YOU_PROJECT_NAME.git`  

4. Deploy to heroku  
`git push heroku master`  
Use `git push` to push to origin github.  



