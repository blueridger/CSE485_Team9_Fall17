function debug(message) {
    if (GameEngine.debug) console.log(message);
  }

function GameEngine() {
  //Start Properties
  
  this.constructor.debug = true;

  var map = null;
  var gui = null;
  var interpreter = null;
  var playInterval = null;
  
  //End Properties
  //Start Main
  map = mapGenStub();
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
	var batteryPos = [1, 5];
    var map = new Map(vWalls, hWalls, playerPos, playerDir, batteryPos);
    return map;
  }

  
  this.generateCodeAndLoadIntoInterpreter = function() 
  {
    // Generate JavaScript code and parse it.
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    resetStepUi(true);
    //BlocklyUtility.resetStepUi(true);
    //resetStepUi(true);
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
      //gui.moveForward(false);
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
      //gui.moveBackward(false);
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
  
  //End Private Methods
  //Start Privileged Methods

  //return boolean true if level won
  function step(play) {
    debug("GameEng.step() called.");
    
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

            return;
          }
          else
          {
            debug("more code");
          }
        }
        // Keep executing until a highlight statement is reached,
        // or the code completes or errors.
      } while (hasMoreCode && !highlightPause);
  }
  this.step = function() { step(); }
  
  //return boolean true if level won
  this.play = function () {
    debug("GameEng.play() called.");
	playInterval = setInterval(step, 2000);
    step();
  }

  //return void
  this.pause = function () {
    debug("GameEng.pause() called.");
	clearInterval(playInterval);
  }

  //return void
  this.resetLevel = function () {
    debug("GameEng.resetLevel() called.");
    map.resetLevel();
    gui.setup(map);
  }
  //End Privileged Methods
  gui.setup(map);
}
