function GameEngine() {
  //Start Properties
  
  this.constructor.debug = true;

  var map = null;
  var gui = null;
  var interpreter = null;
  var play = false; //flag for play/pause functionality
  
  //End Properties
  //Start Main
  map = mapGenSTUB();
  debug("Map Generated");
  gui = new guiMOCK(this);
  debug("GUI object created");
  //End Main
  //Start Private Methods

  //returns a real map to test with
  function mapGenStub() {
    var vWalls = [true, true, false, false, true, false, true, true, false, false, false, false, true, true, true, false, true, false, false, false, true];
	var hWalls = [true, false, false, true, true, true, true, true, true, false, false, true, true, true, false, true, true, false, false, true, true, false, true, true];
	var playerPos = [0, 0];
	var playerDir = 1;
	var batteryPos = [1, 5];
    var map = new Map(vWalls, hWalls, playerPos, playerDir, batteryPos);
    return map;
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

  function debug(message) {
    if (GameEngine.debug) console.log(message);
  }

  function setupInterpreter() {
    if (interpreter == null) 
    {
      
    } 
    else 
    {
      //Check to see if the code has been 
    }
  }
  
  this.generateCodeAndLoadIntoInterpreter = function() 
  {
    // Generate JavaScript code and parse it.
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    resetStepUi(true);
    debug("new code: " + latestCode);
  }
  
  function resetStepUi(clearOutput) 
  {
    demoWorkspace.highlightBlock(null);
    highlightPause = false;
  }	
  
  //API to link the interpretter sandbox to the actual code
  function initApi(interpreter, scope)
  {
    var wrapper;
    wrapper = function(id) 
    {
      moveForward();
    };
    interpreter.setProperty(scope, 'moveForward',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      moveBackward();
    };
    interpreter.setProperty(scope, 'moveBackward',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      turnRight();
    };
    interpreter.setProperty(scope, 'turnRight',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      turnLeft();
    };
    interpreter.setProperty(scope, 'turnLeft',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      openRight();
    };
    interpreter.setProperty(scope, 'openRight',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      openLeft();
    };
    interpreter.setProperty(scope, 'openLeft',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      openRear();
    };
    interpreter.setProperty(scope, 'openRear',
    interpreter.createNativeFunction(wrapper));
		
    wrapper = function(id) 
    {
      openFront();
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
  function highlightBlock(id) 
  {
    demoWorkspace.highlightBlock(id);
    highlightPause = true;
  }
  
  function moveForward() {
    if (map.movePlayerForward()) {
      gui.moveForward(true);
    } 
    else {
      gui.moveForward(false);
      //TODO implement crash case
    }
  }
  
  function moveBackward() {
    if (map.movePlayerBackward()) {
      gui.moveBackward(true);
    } 
    else {
      gui.moveBackward(false);
	  //TODO implement crash case
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
    return map.openRight();
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
  
  //End Private Methods
  //Start Privileged Methods
  
  this.callback = function () {
    debug("GameEng.callback() called.");
    if (play) this.step();
  }

  //return boolean true if level won
  this.step = function () {
    debug("GameEng.step() called.");
    //setupInterpreter();
    /*if (!interpreter.step()) {
      //restart interpreter from the beginning
    }*/
    
    if (!interpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi();
        interpreter = new Interpreter(latestCode, initApi);

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function() {
          highlightPause = true;
          this;
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

            interpreter = null;
            resetStepUi();

            // Cool down, to discourage accidentally restarting the program.

            return;
          }
        }
        // Keep executing until a highlight statement is reached,
        // or the code completes or errors.
      } while (hasMoreCode && !highlightPause);
  }
  
  //return boolean true if level won
  this.play = function () {
    debug("GameEng.play() called.");
    play = true;
    this.step();
  }

  //return void
  this.pause = function () {
    debug("GameEng.pause() called.");
    play = false;
  }

  //return void
  this.resetLevel = function () {
    debug("GameEng.resetLevel() called.");

  }
  //End Privileged Methods
}
