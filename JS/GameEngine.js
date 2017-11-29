//import GUI and map gen

function GameEngine() {
  //Start Properties
  
  var debug = true;
  var map = null;
  var gui = null;
  var interpreter = null;
  var play = false; //flag for play/pause functionality
  
  //End Properties
  //Start Main
  map = mapGenSTUB();
  gui = new guiMOCK(this);
  //End Main
  //Start Private Methods

  //returns a real map to test with
  function mapGenStub() {

  }

  //constructor for a gui stub
  function guiMOCK(GameEngine) {
    var gameEng = GameEngine;

    this.moveForward = function (isSuccess) {
      setTimeout(gameEng.callback, 2000);
    }

    this.moveBackward = function (isSuccess) {
      setTimeout(gameEng.callback, 2000);
    }

    this.turnRight = function () {
      setTimeout(gameEng.callback, 2000);
    }

    this.turnLeft = function () {
      setTimeout(gameEng.callback, 2000);
    }

    this.killBattery = function () { };
    this.resetPosition = function () { };
    this.resetInstructions = function () { };
    this.setup = function () { };

  }

  function setupInterpreter() {
    if (interpreter == null) {

    } else {

    }
  }
  
  function moveForward() {
    if (!player.tile.walls[player.direction]) {
		  player.tile.player = false;
		  map.playerTile = map.getAdjacentTiles(player.tile.index)[player.direction];
		  player.tile = map.playerTile;
		  player.tile.player = true;
		  gui.moveForward();
    } else {
      //TODO implement crash case, see Class Diagrams for gui function parameters
    }
  }
  
  function moveBackward() {
	  if (!player.tile.walls[(player.direction + 2 )% 4]) {
		  player.tile.player = false;
		  map.playerTile = map.getAdjacentTiles(player.tile.index)[(player.direction + 2) % 4];
		  player.tile = map.playerTile;
		  player.tile.player = true;
      gui.moveBackward();
    } else {
      //TODO implement crash case, see Class Diagrams for gui function parameters
    }
  }
  
  function turnRight() {
	  player.direction = (player.direction + 1) % 4;
	  gui.turnRight();
  }
  
  function turnLeft() {
	  player.direction = (player.direction - 1) % 4;
	  gui.turnLeft();
  }
  
  function openRight() {
	  return !player.tile.walls[(player.direction + 1) % 4];
  }
  
  function openLeft() {
	  return !player.tile.walls[(player.direction - 1) % 4];
  }
  
  function openRear() {
	  return !player.tile.walls[(player.direction + 2) % 4];
  }
  
  function openFront() {
	  return !player.tile.walls[player.direction];
  }
  
  //End Private Methods
  //Start Privileged Methods
  
  this.callback = function() {
    if (play) this.step();
  }

  //return boolean true if level won
  this.step = function() {
    setupInterpreter();
    if (!interpreter.step()) {
      //restart interpreter from the beginning
    }
  }
  
  //return boolean true if level won
  this.play = function() {
    play = true;
    this.step();
  }

  //return void
  this.pause = function() {
    play = false;
  }

  //return void
  this.resetLevel = function() {

  }
  //End Privileged Methods
}
