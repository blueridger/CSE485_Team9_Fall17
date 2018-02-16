function debug(message) {
    if (GameEngine.debug) console.log(message);
  }

function GameEngine() {
  //Start Properties
  
  this.constructor.debug = true;

  var map = null;
  var gui = null;
  var interpreter = null;
  var playTimeout = null;
  var score = 0;
  var level = 1;
  var lastLevelModified = level;
  var blocklyChangeHandler = new ChangeHandler(this);
  var playSpeed = 1000;
  var isPlaying = false;
  
  //End Properties
  //Start Main
  this.blocklyChangeHandler = blocklyChangeHandler;
  map = GenerateMap(6,3);
  debug("Map Generated");
  gui = new GUI();
  debug("GUI object created");
  //End Main
  //Start Private Methods

  //returns a real map to test with
  function mapGenStub() {
    var vWalls = [true, true, false, false, true, false, true, true, false, false, false, false, true, true, true, false, true, false, false, false, true];
	var hWalls = [true, false, false, true, true, true, true, true, true, false, false, true, true, true, false, true, true, false, false, true, true, false, true, true];
	var playerPos = [0, 0];
	var playerDir = 1;
	var batteryPos = [1, 1];
	var batterySize = 5;
    var map = new Map(vWalls, hWalls, playerPos, playerDir, batteryPos, batterySize);
    return map;
  }
  
  function getMap() {
    return GenerateMap(6,3);
  }

  
  this.generateCodeAndLoadIntoInterpreter = function() 
  {
    // To make sure no other blockly functions have the name highlightBlock
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    //generate the runnable code from the blocks
    latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    resetStepUi(true);
    debug("new code: " + latestCode);
  }
  
  //nullifies the interpreter without generating new code
  function removeInterpreter()
  {
    interpreter = null;
    demoWorkspace.highlightBlock(null);
  }
  this.removeInterpreter = removeInterpreter;
  
  //unhighlights the current block and sets a flag that the step() funtion should stop executing
  function resetStepUi(clearOutput) 
  {
    demoWorkspace.highlightBlock(null);
    highlightPause = false;
  }	
  
  //API to link the interpreter sandbox to the actual code
  //Must remain in GameEngine.js
  function initApi(interpreter, scope)
  {
    var wrapper;
    wrapper = function(id) 
    {
      return moveForward();
    };
    interpreter.setProperty(scope, 'moveForward',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return moveBackward();
    };
    interpreter.setProperty(scope, 'moveBackward',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return turnRight();
    };
    interpreter.setProperty(scope, 'turnRight',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return turnLeft();
    };
    interpreter.setProperty(scope, 'turnLeft',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return openRight();
    };
    interpreter.setProperty(scope, 'openRight',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return openLeft();
    };
    interpreter.setProperty(scope, 'openLeft',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return openRear();
    };
    interpreter.setProperty(scope, 'openRear',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      return openFront();
    };
    interpreter.setProperty(scope, 'openFront',
    interpreter.createNativeFunction(wrapper));
			
			// Add an API function for highlighting blocks.
    var wrapper = function(id) 
    {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
    interpreter.createNativeFunction(wrapper));
  }
  
  //function to highlight blocks
  //send a flag to the step() function to pause
  function highlightBlock(id) 
  {
    demoWorkspace.highlightBlock(id);
    highlightPause = true;
  }
  
  function moveForward() {
    debug("GameEng.moveForward() called.");
    var canMove = map.movePlayerForward();
    debug("canMove = " + canMove);
    if (canMove) {
      gui.moveForward(true);
    } 
    else {
      pause();
      gui.moveForward(false);
      gui.loseGame(false);
      resetLevel();
    }
  }
  
  function moveBackward() {
     debug("GameEng.moveBackward() called.");
     var canMove = map.movePlayerBackward();
     debug("canMove = " + canMove);
    if (canMove) {
      gui.moveBackward(true);
    } 
    else {
      pause();
      gui.moveBackward(false);
      gui.loseGame(false);
      resetLevel();
    }
  }
  
  function turnRight() {
    debug("GameEng.turnRight() called.");
    map.turnPlayerRight();
    gui.turnRight();
  }
  
  function turnLeft() {
    debug("GameEng.turnLeft() called.");
    map.turnPlayerLeft();
    gui.turnLeft();
  }
  
  function openRight() {
    debug("GameEng.openRight() called.");
    var isOpen = map.openRight();
    debug("isOpen = " + isOpen);
    return isOpen;
  }
  
  function openLeft() {
    debug("GameEng.openLeft() called.");
    return map.openLeft();
  }
  
  function openRear() {
    debug("GameEng.openRear() called.");
    return map.openRear();
  }
  
  function openFront() {
    debug("GameEng.openFront() called.");
    return map.openFront();
  }
  
  function checkGameState() {
    debug("GameEng.checkGameState called.");
    if (map.isWin()) {
      pause();
      var levelScore = getLevelScore();
      score += levelScore;
      level++;
      gui.winGame(levelScore, score, level);
      gui.setLevelScore(getLevelScore());
      map = getMap();
      resetLevel();
      return true;
    } else if (map.isDead()) {
      pause();
      gui.loseGame(true);
      resetLevel(); //After a delay??
      return true;
    }
    return false;
  }
  
  function getLevelScore() {
    return blocklyChangeHandler.getBlockCount(demoWorkspace) * Math.pow(2, Math.max(level - lastLevelModified, 0));
  }
  
  //End Private Methods
  //Start Privileged Methods

  //return boolean true if level won
  function step(play) {
    debug("GameEng.step() called privately.");
    
    if (!interpreter) {
      // First statement of this code.
      // Clear the program output.
      //this.blocklyWorker.resetStepUi();
      resetStepUi(true);
      interpreter = new Interpreter(latestCode, initApi);
      debug(interpreter.ast);

      // And then show generated code in an alert.
      // In a timeout to allow the outputArea.value to reset first.
      //var thisPointer = this;
      setTimeout(function() {
        highlightPause = true;
        this;
        GAME_ENGINE.step();
      }, 1);
      return;
    }
    highlightPause = false;
    
    do {
      
      try {
        var hasMoreCode = interpreter.step();
      } finally {
        if (!hasMoreCode) {
          // Program complete, no more code to execute.
          //outputArea.value += '\n\n<< Program complete >>';
          debug("no more code");
          interpreter = null;
          //this.blocklyWorker.resetStepUi();
          resetStepUi(true)
          step();
        }
        else
        {
          debug("more code");
        }
      }
      // Keep executing until a highlight statement is reached,
      // or the code completes or errors.
    } while (hasMoreCode && !highlightPause && interpreter);
    if (highlightPause && !checkGameState() && isPlaying) {
      playTimeout = setTimeout(step, playSpeed);
    }
    
  }
  this.step = function() {
    debug("GameEng.step() called publicly.");
    step();
  }
  
  this.play = function() {
    debug("GameEng.play() called.");
    if (!isPlaying) {
      isPlaying = true;
      step();
    }
  }

  //return void
  function pause() {
    debug("GameEng.pause() called.");
    clearTimeout(playTimeout);
    isPlaying = false;
  }
  this.pause = pause;

  function resetLevel() {
    debug("GameEng.resetLevel() called.");
    pause();
    map.resetLevel();
    gui.setup(map);
    removeInterpreter();
  }
  this.resetLevel = resetLevel;
  
  this.setPlaySpeed = function(speed) {
    playSpeed = speed;
  }
  
  this.instructionsModified = function() {
    debug("GameEng.instructionsModified() called.");
    lastLevelModified = level;
    gui.setLevelScore(getLevelScore());
    resetLevel();
  }
  //End Privileged Methods
  gui.setup(map);
}
