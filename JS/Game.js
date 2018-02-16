function GUI(){
	//Private vars
    var robot = null;
    var battery = null;
	var score = 0;
	var gameAreaDiv = null;
	var gameArea = null;
	var gameMap = null;
	var debug = true;
	var gameWon = false;
	var gameLost = false;
	
	var robotImages = {
		north: "ship_north.png",
		south: "ship_south.png",
		east: "ship_east.png",
		west: "ship_west.png"
	};

	
	//defines defaults to use.
	var settings = {
		columns: 6,
		rows: 3,
		width: 500,
		height: 495,
		robotStart: [0,0],
		batteryStart : [0,0],
        robotDirection: 'right'
	};
	
	//Public vars
	
	
	
	//Public methods
	this.setup = function (map) {
	    gameMap = map;
	    getInitialValues(gameMap);
		gameAreaDiv = document.getElementById("GameArea");
		getGameDimensions(gameAreaDiv);
		
		

		this.debug("GameArea ={ width: " + settings.width + ", height: " + settings.height + "}");
    
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
	    this.debug("x: " + robot.x + " | y: " + robot.y + " | f: " + robot.facing);

        //Clears the game area so it can be re-written
	    gameArea.clear();

	    
	    if (robot.col == settings.batteryStart[0] && robot.row == settings.batteryStart[1])
	    {
	        gameWon = true;
	    }
	    //Redrwas each element of the game area
		drawGrid();
		drawMap();
		battery.update();
		robot.update();
	}

	this.winGame = function(acquiredLevelScore, gameScore, levelNumber)
	{
    document.getElementById("mr-gameScore").innerHTML = gameScore;
    document.getElementById("mr-levelScore").innerHTML = acquiredLevelScore;
    document.getElementById("mr-levelNumber").innerHTML = levelNumber;
	    displaySimpleModal("Winner!", "Congrats!!!! You Win!!");
	}

	this.loseGame = function(isBatteryDead) //crash case if false
	{
	    displaySimpleModal("Loser!", "You Crashed!");
	}
  
  this.setLevelScore = function(levelScore) { document.getElementById("mr-levelScore").innerHTML = levelScore; }


	this.debug = function(message)
	{
	    if (debug) console.log("GUI: " + message);
	}

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
		        case 'left':
		            robot.x = robot.x - moveAmtX;
		            break;

		            //up
		        case 'up':
		            robot.y = robot.y - moveAmtY;
		            break;

		            //right
		        case 'right':
		            robot.x = robot.x + moveAmtX;
		            break;

		            //down
		        case 'down':
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
		        case 'left':
		            robot.x = robot.x + moveAmtX;
		            break;
		            //up
		        case 'up':
		            robot.y = robot.y + moveAmtY;
		            break;

		            //right
		        case 'right':
		            robot.x = robot.x - moveAmtX;
		            break;

		            //down
		        case 'down':
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
		  case 'left':
			robot.facing = 'down';
			break;

		  //up
		  case 'up':
			robot.facing = 'left';
			break;

		  //right
		  case 'right':
			robot.facing = 'up';
			break;

		  //down
		  case 'down':
			robot.facing = 'right';
			break;
		}
		this.updateGameArea();
	  }

	this.turnRight = function(){
		switch(robot.facing)
		{
		  //left
		  case 'left':
			robot.facing = 'up';
			break;

		  //up
		  case 'up':
			robot.facing = 'right';
			break;

		  //right
		  case 'right':
			robot.facing = 'down';
			break;

		  //down
		  case 'down':
			robot.facing = 'left';
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

		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
	
	
	var robotComponent = function(width, height, x, y, facing){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.facing = facing;
		this.row = y/height;
		this.col = x/width;

		var row = y / (height / settings.rows);
		var col = x / (width / settings.columns);

		this.update = function() {
			ctx = gameArea.context;
			var img = new Image();
			
			img.onload = function(){
				ctx.drawImage(img,robot.x, robot.y,width, height);
			}
			
			switch(robot.facing){
				case "right":
					img.src = "images/" + robotImages.east;
					break;
				case "left":
					img.src = "images/" + robotImages.west;
					break;
				case "up":
					img.src = "images/" + robotImages.north;
					break;
				case "down":
					img.src = "images/" + robotImages.south;
					break;
			}
		}
	}

	var batteryComponent = function (width, height, x, y) {
	    this.width = width;
	    this.height = height;
	    this.x = x;
	    this.y = y;

	    this.update = function () {
	        ctx = gameArea.context;
	        var img = new Image();

	        img.onload = function () {
	            ctx.drawImage(img, battery.x, battery.y, width, height);
	        }
	        img.src = "images/tmpBattery.png";
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
	}

	function getInitialValues(map)
	{
    
        switch(map.getDirection()) {
        case Map.NORTH:
            settings.robotDirection = 'up';
            break;
        case Map.EAST:
            settings.robotDirection = 'right';
            break;
        case Map.SOUTH:
            settings.robotDirection = 'down';
            break;
        default:
            settings.robotDirection = 'left';
        }
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

		ctx.strokeStyle = "#ff0000";
		ctx.stroke();
	}


	function displaySimpleModal(title,message)
	{
	    var modalDiv = '<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';

	    modalDiv += '  <div class="modal-dialog" role="document">';
	    modalDiv += '    <div class="modal-content">';
	    modalDiv += '      <div class="modal-header">';
	    modalDiv += '        <h5 class="modal-title" id="exampleModalLabel">'+ title +'</h5>';
	    modalDiv += '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">';
	    modalDiv += '          <span aria-hidden="true">&times;</span>';
	    modalDiv += '        </button>';
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-body">';
	    modalDiv += message;
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-footer">';
	    modalDiv += '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
	    modalDiv += '      </div>';
	    modalDiv += '    </div>';
	    modalDiv += '  </div>';
	    modalDiv += '</div>';
	    $(modalDiv).modal();
	}
	
	function drawGrid(){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
	
		ctx.beginPath();
	
		for (var y = 0; y <= height; y += height/settings.rows) {
			ctx.moveTo(0,y);
			ctx.lineTo(width,y);
		}

		for (var x = 0; x <= width; x += width/settings.columns) {
			ctx.moveTo(x,0);
			ctx.lineTo(x,height);
		}

		ctx.strokeStyle = "#393939";
		ctx.stroke();
	}
}