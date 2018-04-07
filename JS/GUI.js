function GUI(){
	//Private vars
    var robot = null;
    var battery = null;
	var score = 0;
	var gameAreaDiv = null;
	var gameArea = null;
	var gameMap = null;
	var gameWon = false;
	var gameLost = false;
	var updateFunc = null;
	
	var robotImages = {
		north: "RobotBackward.png",
		south: "RobotForward.png",
		east: "RobotRight.png",
		west: "RobotLeft.png",
		eastCrash: "RobotRight_crash.png",
		westCrash: "RobotLeft_crash.png",
        win: "RobotWin.png"
	};

	
	//defines defaults to use.
	var settings = {
		columns: 6,
		rows: 3,
		width: 500,
		height: 495,
		robotStart: [0,0],
		batteryStart : [0,0],
        robotDirection: Map.EAST
	};
	
	//Public vars
	
	
	
	//Public methods
	this.setup = function (map) {
	    gameMap = map;
	    getInitialValues(gameMap);
		gameAreaDiv = document.getElementById("GameArea");
		getGameDimensions(gameAreaDiv);
		
		

		//debug("GameArea ={ width: " + settings.width + ", height: " + settings.height + "}");
    
        if(typeof arrangeButtons === "function")
        {
            arrangeButtons(true);
        }
    
		var width = settings.width/settings.columns;
		var height = settings.height/settings.rows;

		battery = new batteryComponent(width, height, width * settings.batteryStart[1], height * settings.batteryStart[0]);
		robot = new robotComponent(width, height, width * settings.robotStart[1], height * settings.robotStart[0], settings.robotDirection);
		
		gameArea.start();
		
		this.updateGameArea();
		
	}
	
	this.updateGameArea = function () {
	    updateGame();
	}

	var updateGame = function () {
	    debug("GUI:  cX: " + robot.currentX + " | cY: " + robot.currentY + "x: " + robot.x + " | y: " + robot.y + " | f: " + robot.facing);

	    //Clears the game area so it can be re-written
	    gameArea.clear();


	    if (robot.col == settings.batteryStart[0] && robot.row == settings.batteryStart[1]) {
	        gameWon = true;
	    }

	    //Redrwas each element of the game area
	    drawGrid();
	    drawMap();
	    battery.update();
	    robot.update();
	}

	this.winLevel = function(acquiredLevelScore, gameScore, levelNumber, isEndGame)
	{
    //TODO use isEndGame param
        
	    gameWon = true;

	    updateGame();
        // Update Scores and level
        document.getElementById("mr-gameScore").innerHTML = gameScore;
        document.getElementById("mr-levelScore").innerHTML = acquiredLevelScore;
        document.getElementById("mr-levelNumber").innerHTML = levelNumber;

        //Clear images
        //robot.img = null;
        battery.img = null;

        //Display Win text
        displaySimpleModal("Winner!", "Congrats!!!! You Win!!", "Next Level", true);
	}

	this.loseLevel = function(isBatteryDead) //crash case if false
	{
	    gameLost = true;
	    updateGame();

	    
	    if (isBatteryDead) {
	        displaySimpleModal("You Lost!", "Your battery died!", "Try Again");
	    }
	    else {
	        displaySimpleModal("You Lost!", "You Crashed!", "Try Again");
	    }
	}
  
    this.setLevelScore = function(levelScore) { document.getElementById("mr-levelScore").innerHTML = levelScore; }


	//TODO
	//If isSuccess is true, move robot
	//If false, crash animation
	this.moveForward = function(isSuccess){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height/settings.rows;

		if (!isSuccess) {
		    gameLost = true;
		    //alert("Hit Wall");
		}
		else {
		    switch (robot.facing) {
		        //left
		        case Map.WEST:
		            robot.x = robot.x - moveAmtX;
		            break;

		            //up
		        case Map.NORTH:
		            robot.y = robot.y - moveAmtY;
		            break;

		            //right
		        case Map.EAST:
		            robot.x = robot.x + moveAmtX;
		            break;

		            //down
		        case Map.SOUTH:
		            robot.y = robot.y + moveAmtY;
		            break;
		    }
		    robot.row = robot.y / moveAmtY;
		    robot.col = robot.x / moveAmtX;
		    this.updateGameArea();
		}
	}

	//TODO
	//If isSuccess is true, move robot
	//If false, crash animation
	this.moveBackward = function(isSuccess){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height / settings.rows;


		if (!isSuccess) {
		    gameLost = true;
		    alert("Hit Wall");
		}
		else {
		    switch (robot.facing) {
		        //left
		        case Map.WEST:
		            robot.x = robot.x + moveAmtX;
		            break;
		            //up
		        case Map.NORTH:
		            robot.y = robot.y + moveAmtY;
		            break;

		            //right
		        case Map.EAST:
		            robot.x = robot.x - moveAmtX;
		            break;

		            //down
		        case Map.SOUTH:
		            robot.y = robot.y - moveAmtY;
		            break;
		    }

		    robot.row = robot.y / moveAmtY;
		    robot.col = robot.x / moveAmtX;

		    this.updateGameArea();
		}
	  }

	this.turnLeft = function(){
		switch(robot.facing)
		{
		  //left
		  case Map.WEST:
			robot.facing = Map.SOUTH;
			break;

		  //up
		  case Map.NORTH:
			robot.facing = Map.WEST;
			break;

		  //right
		  case Map.EAST:
			robot.facing = Map.NORTH;
			break;

		  //down
		  case Map.SOUTH:
			robot.facing = Map.EAST;
			break;
		}
		this.updateGameArea();
	  }

	this.turnRight = function(){
		switch(robot.facing)
		{
		  //left
		  case Map.WEST:
			robot.facing = Map.NORTH;
			break;

		  //up
		  case Map.NORTH:
			robot.facing = Map.EAST;
			break;

		  //right
		  case Map.EAST:
			robot.facing = Map.SOUTH;
			break;

		  //down
		  case Map.SOUTH:
			robot.facing = Map.WEST;
			break;
		}
		this.updateGameArea();
	}
	
	//Private methods
	gameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = settings.width;
			this.canvas.height = settings.height;
			this.context = this.canvas.getContext("2d");

			gameAreaDiv.appendChild(this.canvas);
			
		},

		clear: function () {
		    if (typeof this.context != "undefined") {
		        debug("GUI: game area cleared");
		        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		    }

		}
	}
	
	
	var robotComponent = function(width, height, x, y, facing){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.currentX = x;
		this.currentY = y;
		this.facing = facing;
		this.row = y/height;
		this.col = x / width;
		this.img = new Image();
		var parent = this;

		var row = y / (height / settings.rows);
		var col = x / (width / settings.columns);

		this.update = function() {
			ctx = gameArea.context;

			if (gameWon)
			{
			    parent.img.src = "images/" + robotImages.win;
			    gameWon = false;
			}
			else {
			    switch (robot.facing) {
			        case Map.EAST:
			            parent.img.src = "images/" + robotImages.east;
			            if (gameLost) {
			                parent.img.src = "images/" + robotImages.eastCrash;
			            }
			            break;
			        case Map.WEST:
			            parent.img.src = "images/" + robotImages.west;
			            if (gameLost) {
			                parent.img.src = "images/" + robotImages.westCrash;
			            }
			            break;
			        case Map.NORTH:
			            parent.img.src = "images/" + robotImages.north;
			            break;
			        case Map.SOUTH:
			            parent.img.src = "images/" + robotImages.south;
			            break;
			    }
			}

			parent.img.onload = function () {
			    ctx.drawImage(parent.img, parent.x, parent.y, parent.width, parent.height);
			}
			gameLost = false;
			
		}
	}

	var batteryComponent = function (width, height, x, y) {
	    this.width = width;
	    this.height = height;
	    this.x = x;
	    this.y = y;
	    this.img = new Image();
	    var parent = this;

	    this.update = function () {
	        ctx = gameArea.context;

	        parent.img.src = "images/RobotBattery.png";

	        parent.img.onload = function () {
	            ctx.drawImage(parent.img, parent.x, parent.y, parent.width, parent.height);
	        }  
	    }
	}
	
	function getGameDimensions(elem) {
		var tmpWidth = elem.clientWidth;
	
		for(var i = tmpWidth; i > tmpWidth-settings.columns; i--)
		{
			if(i%settings.columns == 0)
			{
				tmpWidth = i;
			}
		}
	
		settings.width = tmpWidth;
		settings.height = (tmpWidth / settings.columns) * settings.rows;

		if(settings.height > 500)
		{
		    settings.height = 500;
		    settings.width = (500 / settings.rows) * settings.columns;
		}
	}

	function getInitialValues(map)
	{
    
        settings.robotDirection = map.getDirection()
        settings.columns = map.getWidth();
        settings.rows = map.getHeight();

	    for (var x = 0; x < settings.columns; x++) {
	        for (var y = 0; y < settings.rows; y++) {

	            var row = y;
	            var col = x;
	            
	            var tile = gameMap.getTile([row, col]);

	            if(tile.containsPlayer())
	            {
	                settings.robotStart = [row,col];
	            }
	            
	            if (tile.containsBattery()) {
	                settings.batteryStart = [row, col];
	            }
	        }
	    }
	}
	
	function drawMap(){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
		ctx.beginPath();
		ctx.lineWidth = 7;
	
		for (var x = 0; x < width; x += width/settings.columns) {
			for (var y = 0; y < height; y += height/settings.rows) {
				
				var row = y/(height/settings.rows);
				var col = x/(width/settings.columns);
				//alert(row + " " + col);
				var walls = gameMap.getTile([row,col]).getWalls();
				
				//north
				if(walls[0]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
					ctx.moveTo(x,y);
					ctx.lineTo(xLineTo,y);
				}
				
				//east
				if(walls[1]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
					ctx.moveTo(xLineTo,y);
					ctx.lineTo(xLineTo,yLineTo);
				}
				
				//south
				if(walls[2]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
					ctx.moveTo(x,yLineTo);
					ctx.lineTo(xLineTo,yLineTo);
				}
				
				//west
				if(walls[3]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
					ctx.moveTo(x,y);
					ctx.lineTo(x,yLineTo);
				}
			}
		}

		ctx.strokeStyle = "#730101";
		ctx.stroke();
	}


	function displaySimpleModal(title,message, buttonMsg, isWon)
	{
	    var modalDiv = '<div class="modal fade" id="simpleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >';

	    modalDiv += '  <div class="modal-dialog modal-dialog-centered" role="document">';
	    modalDiv += '    <div class="modal-content">';
	    modalDiv += '      <div class="modal-header">';
	    modalDiv += '        <h5 class="modal-title" id="exampleModalLabel">'+ title +'</h5>';
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-body">';
	    if (typeof isWon != "undefined")
	    {
	        if (isWon)
	            modalDiv += "<img src='images/RobotWin.png' width='100px'/>";
	    }
	    modalDiv += message;
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-footer">';
	    if (typeof buttonMsg == "undefined") {
	        modalDiv += '        <button type="button" class="btn btn-secondary" onclick="GAME_ENGINE.resetLevel();" data-dismiss="modal">Next Level</button>';
	    }
	    else {
	        modalDiv += '        <button type="button" class="btn btn-secondary" onclick="GAME_ENGINE.resetLevel();" data-dismiss="modal">' + buttonMsg + '</button>';
	    }
	    modalDiv += '      </div>';
	    modalDiv += '    </div>';
	    modalDiv += '  </div>';
	    modalDiv += '</div>';
	    $(modalDiv).modal({ backdrop: 'static', keyboard: false });
	}
	
	function drawGrid(){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
	
		ctx.beginPath();
		ctx.lineWidth = 1;
	
		for (var y = 0; y <= height; y += height/settings.rows) {
			ctx.moveTo(0,y);
			ctx.lineTo(width,y);
		}

		for (var x = 0; x <= width; x += width/settings.columns) {
			ctx.moveTo(x,0);
			ctx.lineTo(x,height);
		}

		ctx.strokeStyle = "#878787";
		ctx.stroke();
	}
}