function GUI(){
	//Private vars
  var robot = null;
  var battery = null;
	var gameArea = null;
	var gameMap = null;
	var gameWon = false;
	var gameLost = false;
	var batteryDead = false;
	
	var robotImages = {
		north: "RobotBackward.png",
		south: "RobotForward.png",
		east: "RobotRight.png",
		west: "RobotLeft.png",
		northCrash: "RobotBackwardDaze.png",
		southCrash: "RobotForwardDaze.png",
		eastCrash: "RobotRightDaze.png",
		westCrash: "RobotLeftDaze.png",
		lose: "RobotLose.png",
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
	
	
	
	//Public methods
	this.setup = function (map, isReset) {
    if(typeof isReset === 'undefined' || !isReset) {
      gameArea.canvas.removeLayers().clearCanvas()
    }
    
	  gameMap = map;
	  getInitialValues(gameMap);
		getGameDimensions($("#GameArea"));
    gameArea.start();
		
		

		//debug("GameArea ={ width: " + settings.width + ", height: " + settings.height + "}");
    
    if(typeof arrangeButtons === "function")
    {
        arrangeButtons(true);
    }
    
		var width = settings.width/settings.columns;
		var height = settings.height/settings.rows;
    
    
		battery = new batteryComponent(width, height, width * settings.batteryStart[1], height * settings.batteryStart[0]);
		robot = new robotComponent(width, height, width * settings.robotStart[1], height * settings.robotStart[0], settings.robotDirection);
		
		battery.init();
    robot.init();
		
		this.updateGame();
		
	}
	
	this.updateGame = function () {
	    debug("GUI:  x: " + robot.x + " | y: " + robot.y + " | f: " + robot.facing);
      if(typeof GAME_ENGINE != 'undefined')
        robot.update(GAME_ENGINE.getPlayInterval());
	}

	this.winLevel = function(acquiredLevelScore, gameScore, levelNumber, isEndGame)
	{
	    gameWon = true;
      
	    this.updateGame();

      // Update Scores and level
      document.getElementById("mr-gameScore").innerHTML = gameScore;
      document.getElementById("mr-levelScore").innerHTML = acquiredLevelScore;
      document.getElementById("mr-levelNumber").innerHTML = levelNumber;

	    //Display Win text
        if (!isEndGame)
        {
            displaySimpleModal("Level " + (levelNumber - 1) + " Cleared!", "Congrats you Earning " + acquiredLevelScore + " Points", "Next Level", robotImages.win);
        }
        else
        {
            displaySimpleModal("You Beat The Game!", "Congratulations! You are a master Maze Runner! </b> Your High Score is " + gameScore, "Next Level", robotImages.win);
        }
        
	}

	this.loseLevel = function(isBatteryDead) //crash case if false
	{
	    gameLost = true;
	    batteryDead = isBatteryDead;
	    this.updateGame();

	    
	    if (isBatteryDead) {
	        displaySimpleModal("You Lost!", "Your battery died!", "Try Again", robotImages.lose);
	    }
	    else {
	        displaySimpleModal("You Lost!", "You Crashed!", "Try Again", robotImages.lose);
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

		}
		else {
		    switch (robot.facing) {
		        //left
		        case Map.WEST:
                robot.x -= moveAmtX;
		            break;

		            //up
		        case Map.NORTH:
                robot.y -= moveAmtY;
		            break;

		            //right
		        case Map.EAST:
               robot.x += moveAmtX;
		            break;

		            //down
		        case Map.SOUTH:
                robot.y += moveAmtY;
		            break;
		    }
		    robot.row = robot.y / moveAmtY;
		    robot.col = robot.x / moveAmtX;
		    this.updateGame();
		}
	}

	//TODO
	//If isSuccess is true, move robot
	//If false, crash animation
	this.moveBackward = function(isSuccess){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height / settings.rows;


		if (!isSuccess) {
		}
		else {
		    switch (robot.facing) {
		        //left
		        case Map.WEST:
                robot.x += moveAmtX;
		            break;
		            //up
		        case Map.NORTH:
                robot.y += moveAmtY;
		            break;

		            //right
		        case Map.EAST:
                robot.x -= moveAmtX;
		            break;

		            //down
		        case Map.SOUTH:
                robot.y -= moveAmtY;
		            break;
		    }

		    robot.row = robot.y / moveAmtY;
		    robot.col = robot.x / moveAmtX;

		    this.updateGame();
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
		this.updateGame();
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
		this.updateGame();
	}
	
	//Private methods
  
	gameArea = {
		canvas : $("canvas"),
		start : function() {
      this.canvas.prop('width', settings.width);
      this.canvas.prop('height', settings.height);
      gameArea.canvas.clearCanvas();
      drawGrid();
      drawMap();
		}
	}
	
	
	var robotComponent = function(width, height, x, y, facing){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.facing = facing;
		this.row = y/height;
		this.col = x / width;
		this.img = new Image();
		var parent = this;

		var row = y / (height / settings.rows);
		var col = x / (width / settings.columns);
    
    var getImage = function(){
      var retImg = "";
      if (gameWon)
			{
			    retImg = "images/" + robotImages.win;
			}
			else if (batteryDead) {
			    retImg = "images/" + robotImages.lose;
			    gameLost = false;
			}
			else {
			    switch (robot.facing) {
			        case Map.EAST:
			            retImg = "images/" + robotImages.east;
			            if (gameLost) {
			                retImg = "images/" + robotImages.eastCrash;
			            }
			            break;
			        case Map.WEST:
			            retImg = "images/" + robotImages.west;
			            if (gameLost) {
			                retImg = "images/" + robotImages.westCrash;
			            }
			            break;
			        case Map.NORTH:
			            retImg = "images/" + robotImages.north;
			            if (gameLost) {
			                retImg = "images/" + robotImages.northCrash;
			            }
			            break;
			        case Map.SOUTH:
			            retImg = "images/" + robotImages.south;
			            if (gameLost) {
			                retImg = "images/" + robotImages.southCrash;
			            }
			            break;
			    }
			}
      return retImg;  
    }
    
    this.init = function(){
      gameArea.canvas.drawImage({
        source: getImage(),
        layer: true,
        name: 'robot',
        x: parent.x, y: parent.y,
        width: parent.width,
        height: parent.height,
        fromCenter : false
      });
    }

    this.update = function(interval) {
      if(gameWon)
      {
        gameArea.canvas.removeLayer('battery');
        gameArea.canvas.setLayer('robot', {
          source: getImage()
        }).drawLayers();
        gameWon = false;
      }
      else
      {
        
        gameArea.canvas.setLayer('robot', {
          source: getImage()
        }).animateLayer('robot', {
          x: parent.x, y: parent.y
        },interval).drawLayers();
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

	    this.init = function () {
        gameArea.canvas.drawImage({
          source: "images/RobotBattery.png",
          x: parent.x, y: parent.y,
          width: parent.width,
          height: parent.height,
          fromCenter :false,
          layer : true,
          name : 'battery',
          click : function (layer) {
            $(this).animateLayer(layer, {
              rotate: '+=180'
            });
          }
        });
	    }
	}
	
	function getGameDimensions(elem) {
		var tmpWidth = elem.width();
    
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
		var height = gameArea.canvas.height();
		var width = gameArea.canvas.width();

    var paths = {
      strokeStyle : '#730101',
      strokeWidth: 7,
      rounded : true,
      layer :true,
      name: 'map'
    };
    
    var pathCount = 0;
    
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
          pathCount++;
          paths["p"+pathCount] = {
            type: 'line',
            x1: x, y1: y,
            x2: xLineTo, y2: y
          };
				}
				
				//east
				if(walls[1]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
          pathCount++;
          paths["p"+pathCount] = {
            type: 'line',
            x1: xLineTo, y1: y,
            x2: xLineTo, y2: yLineTo
          };
				}
				
				//south
				if(walls[2]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
          pathCount++;
          paths["p"+pathCount] = {
            type: 'line',
            x1: x, y1: yLineTo,
            x2: xLineTo, y2: yLineTo
          };
				}
				
				//west
				if(walls[3]){
					var yLineTo = (y + height/settings.rows);
					var xLineTo = (x + width/settings.columns);
					
          pathCount++;
          paths["p"+pathCount] = {
            type: 'line',
            x1: x, y1: y,
            x2: x, y2: yLineTo
          };
          
				}
			}
		}

		gameArea.canvas.drawPath(paths);
	}


	function displaySimpleModal(title,message, buttonMsg, image)
	{
	    var modalDiv = '<div class="modal fade" id="simpleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >';

	    modalDiv += '  <div class="modal-dialog modal-dialog-centered" role="document">';
	    modalDiv += '    <div class="modal-content">';
	    modalDiv += '      <div class="modal-header">';
	    modalDiv += '        <h5 class="modal-title" id="exampleModalLabel">'+ title +'</h5>';
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-body">';
	    if (typeof image != "undefined")
	    {
	        modalDiv += "<img class='float-left' src='images/"+image+"' width='100px' style='margin-right:1.25em;'/>";
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
	    $(modalDiv).removeData().modal({ backdrop: 'static', keyboard: false });
	}
	
	function drawGrid(){
		var h = gameArea.canvas.height();
		var w = gameArea.canvas.width();
    

    var paths = {
      strokeStyle : '#878787',
      strokeWidth: 1,
      layer :true,
      name: 'grid'
    };
    
    var pathCount = 0;
		for (var y = 0; y <= h; y += h/settings.rows) {
      pathCount++;
      paths["p"+pathCount] = {
        type: 'line',
        x1: 0, y1: y,
        x2: w, y2: y
      };
		}

		for (var x = 0; x <= w; x += w/settings.columns) {
      pathCount++;
      paths["p"+pathCount] = {
        type: 'line',
        x1: x, y1: 0,
        x2: x, y2: h
      };
		}
    gameArea.canvas.drawPath(paths);
	}
}