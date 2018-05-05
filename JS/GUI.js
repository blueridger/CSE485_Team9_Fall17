function GUI(){
	//IMAGE VARS
	var image3Dim = false; // set to true for original 3d images, false for new aerials
	
	//Private vars
    var robot = null;
    var battery = null;
	var gameArea = null;
	var gameMap = null;
	var gameWon = false;
	var gameLost = false;
	var batteryDead = false;
	
	// 3D IMG VALUES
	if (image3Dim === true)
	{
		var robotImages = {
			north: "RobotBackwardN.png",
			south: "RobotForwardN.png",
			east: "RobotRightN.png",
			west: "RobotLeftN.png",
			northCrash: "RobotBackwardDaze.png",
			southCrash: "RobotForwardDaze.png",
			eastCrash: "RobotRightDaze.png",
			westCrash: "RobotLeftDaze.png",
			lose: "RobotLose.png",
			win: "RobotWin.png"
		};
	}
	else{	// AERIAL IMG VALUES
	var robotImages = {
		north: "RobotForward.png",
		south: "RobotForward.png",
		east: "RobotForward.png",
		west: "RobotForward.png",
		northCrash: "RobotBackwardDaze.png",
		southCrash: "RobotForwardDaze.png",
		eastCrash: "RobotRightDaze.png",
		westCrash: "RobotLeftDaze.png",
		lose: "RobotLose.png",
        win: "RobotWin.png"
	};
	}
	
	//defines defaults to use.
	var settings = {
		columns: 6,
		rows: 3,
		width: 500,
		height: 495,
		innerWallWidth: 7,
		outerWallWidth: 14,
		robotStart: [0,0],
		batteryStart : [0,0],
		robotDirection: Map.EAST,
		wallColor: '#730101',
		gridColor: '#878787'
	};
	
	
	
    //Public methods

    //initializes the game araa
	this.setup = function (map, isReset) {

        //Clears the game area if it is a new level or if it is a new map
        if(typeof isReset === 'undefined' || !isReset) {
            gameArea.canvas.removeLayers().clearCanvas();
        }

        gameMap = null;

	    gameMap = map;
	    getInitialValues();
	    getGameDimensions($("#GameArea"));
	    $("#blocklyDiv").height(settings.height);
        gameArea.start();
		
		

    
        if(typeof arrangeButtons === "function")
        {
            arrangeButtons(true);
        }
    
        //Calculates the width and height of each grid square
		var width = settings.width/settings.columns;
		var height = settings.height/settings.rows;
    
		
        //Creates the robot and battery objects
		battery = new batteryComponent(width, height, width * settings.batteryStart[1], height * settings.batteryStart[0]);
		robot = new robotComponent(width, height, width * settings.robotStart[1], height * settings.robotStart[0], settings.robotDirection);
		
		battery.init();
        robot.init();
		
        //Call and update game to add everything to the canvas
		this.updateGame();
		
	}

	
    //This calls the robot update.
	this.updateGame = function () {
	    debug("GUI:  x: " + robot.x + " | y: " + robot.y + " | f: " + robot.facing);

	    if (typeof GAME_ENGINE != 'undefined') {
	        robot.update(GAME_ENGINE.getPlayInterval());
	    }

	    gameArea.updateAria();
	}

    //Called When the level is won
	this.winLevel = function(acquiredLevelScore, gameScore, levelNumber, isEndGame, numUneditedLevels){
	    gameWon = true;

	    this.updateGame();

	    // Update Scores and level
	    document.getElementById("mr-gameScore").innerHTML = gameScore;
	    document.getElementById("mr-levelScore").innerHTML = acquiredLevelScore;
	    document.getElementById("mr-levelNumber").innerHTML = levelNumber;

	    //Display Win text
        if (!isEndGame)
        {
            setTimeout(function () {
              var modifier = Math.pow(2, numUneditedLevels);
              var message = "Congratulations!<br/> " + acquiredLevelScore + " points earned this level.<br/><br/>Your total score is now: " + gameScore + ". Nice work!";
              if (modifier > 1) message = "Congratulations!<br/> " + acquiredLevelScore/modifier + " base points earned this level.<br/>x"
              + modifier + " multiplier for going " + numUneditedLevels + " level" + (numUneditedLevels > 1 ? "s" : "") + " without editing your solution.<br/>=" + acquiredLevelScore
              + " total points earned this level!<br/><br/>Your total score is now: " + gameScore + ". Nice work!";
                displaySimpleModal({
                    title: "Level " + (levelNumber - 1) + " cleared!",
                    message: message,
                    messageImg: robotImages.win
                });
            }, 500);
        }
        else
        {
            //This is added so Z-index above overlay works properly
            gameArea.canvas.css("position", "relative");


            //Adds click events to the overlay and the canvas element for the "Click Anywhere"
            gameArea.canvas.click(function () {
                displaySimpleModal({
                    title: "You Beat The Game!",
                    message: "Congratulations! You are a master Maze Runner! </b> Your final score is " + gameScore,
                    buttonMsg: "Reset Game",
                    messageImg: robotImages.win
                });
            }).fadeIn(100);

            $("#overlay").click(function () {
                displaySimpleModal({
                    title: "You Beat The Game!",
                    message: "Congratulations! You are a master Maze Runner! </b> Your final score is " + gameScore,
                    buttonMsg: "Reset Game",
                    messageImg: robotImages.win
                });
            }).fadeIn(100);


            setTimeout(function () {
                gameWonAnime(gameScore);
            }, 500);
        }
        
	}

    //This handles the game Lose Animation and text
	this.loseLevel = function(isBatteryDead) {
	    gameLost = true;
	    batteryDead = isBatteryDead;

	    this.updateGame();

	    
        //Determines and displays a different message if Bttery is dead vs a crash
	    if (isBatteryDead)
	    {
	        setTimeout(function () {
	            displaySimpleModal({
	                title: "Level Failed!",
	                message: "Your battery died!",
	                buttonMsg: "Try Again",
	                messageImg: robotImages.lose
	            });
	        }, 500);
	    }
	    else
	    {
	        setTimeout(function () {
	            displaySimpleModal({
	                title: "Level Failed!",
	                message: "You Crashed!",
	                buttonMsg: "Try Again",
	                messageImg: robotImages.lose
	            });
	        }, 500);
	    }
	}
  
    //This allows a change to the level score to occur at any time
	this.setLevelScore = function (levelScore) {
	    document.getElementById("mr-levelScore").innerHTML = levelScore;
	}


	//If isSuccess is true, move robot
	//If false, crash animation
	this.moveForward = function(isSuccess){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height / settings.rows;


		if (isSuccess) {
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

		    robot.row = Math.round(robot.y / moveAmtY);
		    robot.col = Math.round(robot.x / moveAmtX);
		    this.updateGame();
		}
	}

	//If isSuccess is true, move robot
	//If false, crash animation
	this.moveBackward = function(isSuccess){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height / settings.rows;


		if (isSuccess){
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

		    robot.row = Math.round(robot.y / moveAmtY);
		    robot.col = Math.round(robot.x / moveAmtX);

		    this.updateGame();
		}
	}
    

    //Handles the turn left command
	this.turnLeft = function () {
	    robot.rotation -= 90;
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

    //Handles the turn right command
	this.turnRight = function () {
	    robot.rotation += 90;
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
 

    //The object that holds the game canvas as well as the intit (Start) function
    //   The start draws the grid and map
	gameArea = {
		canvas : $("canvas"),
		start : function() {
            this.canvas.prop('width', settings.width);
            this.canvas.prop('height', settings.height);

            gameArea.canvas.clearCanvas();
            drawGrid();
            drawMap();
		},

		updateAria: function () {
		    //Provide a text desciption of what is on the canvas

		    /*var direction = ["north", "east", "south", "west"];

		    

            var robotInfo = $("<p></p>");
            robotInfo.append("The Robot is in row " + (+robot.row + 1) + " column " + (robot.col + 1) + " facing " + direction[robot.facing] + ".");

            debug(robot.row + " " + robot.col);
		    var walls = gameMap.getTile([robot.row, robot.col]).getWalls();

		    var isFirst = true;

		    var wallText = "There are walls ";

		    for (var i = 0; i < 4; i++) { 
		        if (walls[i]) {
		            if (!isFirst) {
		                wallText += ",";
		            }
		            wallText += " " + direction[i];

		            isFirst = false;
		        }
		    }

		    robotInfo.append(wallText + ".");

            //Clear Curren info
		    gameArea.canvas.html("");

		    gameArea.canvas.append("<h2>Map Size</h2>")
                .append("<p>The map is " + settings.rows + " rows by " + settings.columns + " columns</p>")
                .append("<h2>Game Play</h2>")
                .append(robotInfo);*/

		}
	}


    //Displays the Game won Animation Fear the Fork
	function gameWonAnime(gameScore) {
	    gameArea.canvas.removeLayers().clearCanvas();

	    var height = gameArea.canvas.height();
	    var width = gameArea.canvas.width();

	    var scale = width;
	    var pY = (height - width) / 2;
	    var pX = 0;

	    if (height < width)
	    {
	        scale = height;
	        pX = (width - height) / 2;
	        pY = 0;
	    }
	    
	    gameArea.canvas.drawImage({
	        source: "images/Fear_Fork.png", 
	        layer: true,
	        name: 'fork',
	        x: pX, y: pY,
	        width: scale,
	        height: scale,
	        fromCenter: false,
	        click: function () {
	            displaySimpleModal({
	                title: "You Beat The Game!",
	                message: "Congratulations! You are a master Maze Runner! </b> Your High Score is " + gameScore,
	                buttonMsg: "Reset Game",
	                messageImg: robotImages.win
	            });
	        }
	    });
	}
	
	
    // This is the robot Componant
	var robotComponent = function(width, height, x, y, facing){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.facing = facing;
		this.rotation = facing * 90;
		this.row = settings.robotStart[0];
		this.col = settings.robotStart[1];
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
            else if (batteryDead)
            {
			    retImg = "images/" + robotImages.lose;
			    gameLost = false;
			}
            else
            {
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

    
        this.init = function () {

            gameArea.canvas.drawImage({
                source: getImage(),
                layer: true,
                name: 'robot',
                x: parent.x, y: parent.y,
                width: parent.width,
                height: parent.height,
                fromCenter: false,
                rotate: this.rotation,
                click: function (layer) {
                    $(this).animateLayer(layer, {
                        rotate: '+=360'
                    });
                }
            });
        }

        this.update = function (interval) {
            gameArea.canvas.stopLayer('robot', true);

            if (gameWon)
            {
                gameArea.canvas.removeLayer('battery');
                gameArea.canvas.setLayer('robot', {
                    source: getImage(),
                    rotate: 0
                }).drawLayers();

                gameWon = false;
            }
            else if(image3Dim)
            {
                gameArea.canvas.setLayer('robot', {
                    source: getImage()
                }).animateLayer('robot', {
                    x: parent.x, y: parent.y,
                    rotate: 0
                },interval*0.5).drawLayers();
            }
            else
            {
                gameArea.canvas.setLayer('robot', {
                    source: getImage()
                }).animateLayer('robot', {
                    x: parent.x, y: parent.y,
                    rotate: robot.rotation
                }, interval * 0.5).drawLayers();
            }
      
			gameLost = false;
			
		}
	}

    //The battery componant
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
                click: function (layer) {

                    //Easter Egg Click Animation
                    $(this).animateLayer(layer, {
                        rotate: '+=180'
                    });
                }
            });
	    }
	}
	
    //Calculates the dimensions of the game based on screen size
	function getGameDimensions(elem) {
	    var tmpWidth = elem.width();
        var controlHeight = $("#mr-scores").height() + $("#mr-scores").height() + $("#mr-navigation").height();

        for (var i = tmpWidth; i > tmpWidth - settings.columns; i--)
		{
			if(i%settings.columns == 0)
			{
				tmpWidth = i;
			}
		}
	
		settings.width = tmpWidth;
		settings.height = (tmpWidth / settings.columns) * settings.rows;

		var maxHeight = window.innerHeight - controlHeight*2;

		if (settings.height > maxHeight)
		{
		    settings.height = maxHeight;
		    settings.width = (maxHeight / settings.rows) * settings.columns;
		}
	}


    //This parses out the initial values based on the provided map
	function getInitialValues()
	{
	    settings.robotDirection = gameMap.getDirection()
	    settings.columns = gameMap.getWidth();
	    settings.rows = gameMap.getHeight();

	    for (var x = 0; x < settings.columns; x++) {
	        for (var y = 0; y < settings.rows; y++) {

	            var row = y;
	            var col = x;
	            
	            var tile = gameMap.getTile([row, col]);

	            if(tile.containsPlayer()){
	                settings.robotStart = [row,col];
	            }
	            
	            if (tile.containsBattery()) {
	                settings.batteryStart = [row, col];
	            }
	        }
	    }
	}
	
    //Renders the map on the Canvas
	function drawMap(){
		var height = gameArea.canvas.height();
		var width = gameArea.canvas.width();

        var innerPaths = {
            strokeStyle : settings.wallColor,
            strokeWidth: settings.innerWallWidth,
            rounded : true,
            layer :true,
            name: 'map'
        };

        var borderPaths = {
            strokeStyle: settings.wallColor,
            strokeWidth: settings.outerWallWidth,
            rounded: true,
            layer: true,
            name: 'mapBorder'
        };
    
        var pathCount = 0;
        var borderPathCount = 0;
        
        for (var col = 0; col < settings.columns; col++) {
            for (var row = 0; row < settings.rows; row++) {
               
                var walls = gameMap.getTile([row, col]).getWalls();

                var y = row * (height / settings.rows);
                var x = col * (width / settings.columns);

                //north
                if (walls[0] && row !=0 ) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);
                    pathCount++;
                    innerPaths["p" + pathCount] = {
                        type: 'line',
                        x1: x, y1: y,
                        x2: xLineTo, y2: y
                    };
                } else if (walls[0] && row == 0){
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);
                    borderPathCount++;
                    borderPaths["p" + borderPathCount] = {
                        type: 'line',
                        x1: x, y1: y,
                        x2: xLineTo, y2: y
                    };
                }


                //east
                if (walls[1] && col != settings.columns-1) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    pathCount++;
                    innerPaths["p" + pathCount] = {
                        type: 'line',
                        x1: xLineTo, y1: y,
                        x2: xLineTo, y2: yLineTo
                    };
                } else if (walls[1] && col == settings.columns - 1) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    borderPathCount++;
                    borderPaths["p" + borderPathCount] = {
                        type: 'line',
                        x1: xLineTo, y1: y,
                        x2: xLineTo, y2: yLineTo
                    };
                }

                //south
                if (walls[2] && row != settings.rows-1) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    pathCount++;
                    innerPaths["p" + pathCount] = {
                        type: 'line',
                        x1: x, y1: yLineTo,
                        x2: xLineTo, y2: yLineTo
                    };
                } else if (walls[2] && row == settings.rows - 1) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    borderPathCount++;
                    borderPaths["p" + borderPathCount] = {
                        type: 'line',
                        x1: x, y1: yLineTo,
                        x2: xLineTo, y2: yLineTo
                    };
                }

                //west
                if (walls[3] && col != 0) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    pathCount++;
                    innerPaths["p" + pathCount] = {
                        type: 'line',
                        x1: x, y1: y,
                        x2: x, y2: yLineTo
                    };

                } else if (walls[3] && col == 0) {
                    var yLineTo = (y + height / settings.rows);
                    var xLineTo = (x + width / settings.columns);

                    borderPathCount++;
                    borderPaths["p" + borderPathCount] = {
                        type: 'line',
                        x1: x, y1: y,
                        x2: x, y2: yLineTo
                    };
                }
                
            }
        }

        gameArea.canvas.drawPath(innerPaths);
        gameArea.canvas.drawPath(borderPaths);
	}


	
	//Renders the Grid on the canvas
	function drawGrid(){
		var h = gameArea.canvas.height();
		var w = gameArea.canvas.width();
    

        var paths = {
            strokeStyle : settings.gridColor,
            strokeWidth: .5,
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


    /*Used for the game modals
    *   options = {
    *       title: '',       required
    *       message: '',     required
    *       messageImg: '',  optional
    *       buttonMsg: '',   optional
    *   }
    */
	function displaySimpleModal(options) {

	    var modalDiv = '<div class="modal fade" id="simpleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >';

	    modalDiv += '  <div class="modal-dialog modal-dialog-centered" role="document">';
	    modalDiv += '    <div class="modal-content">';
	    modalDiv += '      <div class="modal-header">';
	    modalDiv += '        <h5 class="modal-title" id="exampleModalLabel">' + options.title + '</h5>';
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-body">';

	    if (typeof options.messageImg != "undefined") {
	        modalDiv += "<img class='float-left' src='images/" + options.messageImg + "' width='100px' style='margin-right:1.25em;'/>";

	    }

	    modalDiv += options.message;
	    modalDiv += '      </div>';
	    modalDiv += '      <div class="modal-footer">';

	    //Next Level
	    if (typeof options.buttonMsg === "undefined") {
	        modalDiv += '        <button type="button" class="btn btn-secondary" onclick="GAME_ENGINE.resetLevel();" data-dismiss="modal">Next Level</button>';
	    }
	        //Reset Game
	    else if (options.buttonMsg == "Reset Game") {
	        modalDiv += '        <button type="button" class="btn btn-secondary" onclick="location.reload();" data-dismiss="modal">' + options.buttonMsg + '</button>';
	    }
	        //Reset Level
	    else {
	        modalDiv += '        <button type="button" class="btn btn-secondary" onclick="GAME_ENGINE.resetLevel(true);" data-dismiss="modal">' + options.buttonMsg + '</button>';
	    }

	    modalDiv += '      </div>';
	    modalDiv += '    </div>';
	    modalDiv += '  </div>';
	    modalDiv += '</div>';
	    $(modalDiv).removeData().modal({ backdrop: 'static', keyboard: false });
	}
}