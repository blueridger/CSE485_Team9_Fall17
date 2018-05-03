function debug(message) {
  if (GameEngine.debug) console.log(message);
}

function GameEngine(settings) {
  
  //Start Properties
  this.constructor.debug = settings.debug;
  
  this.mapInput;
  
  /*
   * START  Private variables
   */
  var thisEng = this;
  var map;
  var mapSource = settings.mapSource;
  var gui;
  var interpreter = null;
  var playTimeout = null;
  var isPlaying = false;
  var playInterval;
  var userSelectedPlayInterval;
  var MILLISECOND_INTERVAL = [ 2000, 1000, 500, 150 ]
  
  var score = 0;
  var level = 1;
  var numLevels;
  var lastLevelModified = level;
  
  var blocklyChangeHandler;
  var scoreLineCountSubtractionBase = 10; //set <= 1 to disable line-count-based scoring
  var latestCode = "";
  
  /*
   * END  Private variables
   */
  
  /*
   * START  Main
   */
  
  getMap();
  
  /*
   * END  Main
   */

  /*
   * START  Private methods
   */
   
  function postMapSetup() {
    debug("Map Generated");
    gui = new GUI();
    debug("GUI object created");
    gui.setup(map);
    blocklyChangeHandler = new ChangeHandler(thisEng);
    thisEng.blocklyChangeHandler = blocklyChangeHandler;
    if (BlocklyUtility) BlocklyUtility();
  }
   
  async function getMap() {
    map = null;
    if (mapSource == null) {
      numLevels = settings.numberOfLevels;
      map = GenerateMap(2+level,1+level);
      if (level === 1) postMapSetup();
    }
    else {
      numLevels = mapSource.length;
      map = $.getJSON(mapSource[level-1], function( data ) {
        debug("Map " + mapSource[level-1] + " loaded.");
        map = new Map(data.width, data.height, data.verticalWalls, data.horizontalWalls,
          data.playerPosition, data.playerDirection, data.batteryPosition, data.batterySize);
        if (level === 1) postMapSetup();
      });
    }
  }
  
  
  function checkGameState() {
    debug("GameEng.checkGameState called.");
    if (map.isWin()) {
      debug("Level won.");
      pause();
      var levelScore = getLevelScore();
      score += levelScore;
      var isEndGame = level == numLevels;
      level++;
      setTimeout( function() {
        gui.winLevel(levelScore, score, level, isEndGame, level - lastLevelModified);
        if (!isEndGame) {
          gui.setLevelScore(getLevelScore());
          getMap();
        }
      }, playInterval * 1.3);
      return true;
    } else if (map.isDead()) {
      debug("Battery DEAD.");
      pause();
      gui.loseLevel(true);
      return true;
    }
    return false;
  }
  
  function getLevelScore() {
    var base = Math.max(scoreLineCountSubtractionBase - blocklyChangeHandler.getBlockCount(blocklyWorkspace), 1);
    return base * Math.pow(2, Math.max(level - lastLevelModified, 0));
  }
  
  /*
   * END  Private methods
   */
  
  /*
   * START  Privileged methods
   */

  function step() {
    debug("GameEng.step() called privately.");
    
    if (!interpreter) {
      resetStepUi();
      if (latestCode.length > 0)
      {
        interpreter = new Interpreter(latestCode, initApi);
        debug(interpreter.ast);

        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function() {
          highlightPause = true;
          GAME_ENGINE.step();
        }, 1);
      }
      
    } else {
      highlightPause = false;
      do {
        try {
          var hasMoreCode = interpreter.step();
        } finally {
          if (!hasMoreCode) {
            // Program complete, no more code to execute.
            debug("Interpreter has no more code.");
            removeInterpreter();
            resetStepUi()
            step();
          }
          else debug("Interpreter still has more code.");
        }
        // Keep executing until a highlight statement is reached,
        // or the code completes or errors.
      } while (hasMoreCode && !highlightPause && interpreter);
      if (highlightPause && !checkGameState() && isPlaying) {
        playTimeout = setTimeout(step, playInterval);
      }
    }
  }
  this.step = function() {
    debug("GameEng.step() called publicly.");
    step();
  }
  
  this.play = function() {
    debug("GameEng.play() called.");
    if (!isPlaying) {
      arrangeButtons(false); //defined in index.html
      isPlaying = true;
      playInterval = userSelectedPlayInterval;
      step();
    }
  }

  //return void
  function pause() {
    debug("GameEng.pause() called.");
    clearTimeout(playTimeout);
    isPlaying = false;
    arrangeButtons(true); //defined in index.html
    playInterval = MILLISECOND_INTERVAL[MILLISECOND_INTERVAL.length - 1];
  }
  this.pause = pause;

  function resetLevel(isReset) {
    debug("GameEng.resetLevel() called.");
    pause();
    map.resetLevel();
    gui.setup(map,isReset);
    removeInterpreter();
  }
  this.resetLevel = resetLevel;
  
  this.setPlaySpeed = function(speed) {
    userSelectedPlayInterval = MILLISECOND_INTERVAL[speed - 1];
    if (isPlaying) playInterval = userSelectedPlayInterval;
  }
  
  this.getPlayInterval = function() {
    return playInterval;
  }
  
  this.instructionsModified = function() {
    debug("GameEng.instructionsModified() called.");
    lastLevelModified = level;
    gui.setLevelScore(getLevelScore());
    resetLevel(true);
  }
  
  /*
   * END  Privileged methods
   */
  
  /*
   * START  Interpreter-called methods
   */
  
  //function to highlight blocks
  //send a flag to the step() function to pause
  function highlightBlock(id) 
  {
    blocklyWorkspace.highlightBlock(id);
    highlightPause = true;
    return true;
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
      gui.loseLevel(false);
      //resetLevel();
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
      gui.loseLevel(false);
      //resetLevel();
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
  
  /*
   * END  Interpreter-called methods
   */
  
  /*
   * START  Blockly / Interpreter setup
   */
  
  this.generateCodeAndLoadIntoInterpreter = function() 
  {
    // To make sure no other blockly functions have the name highlightBlock
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    //generate the runnable code from the blocks
    latestCode = Blockly.JavaScript.workspaceToCode(blocklyWorkspace);
    resetStepUi();
    debug("new code: " + latestCode);
  }
  
  //nullifies the interpreter without generating new code
  function removeInterpreter()
  {
    interpreter = null;
    blocklyWorkspace.highlightBlock(null);
  }
  this.removeInterpreter = removeInterpreter;
  
  //unhighlights the current block and sets a flag that the step() funtion should stop executing
  function resetStepUi() 
  {
    blocklyWorkspace.highlightBlock(null);
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
  
  /*
   * END  Blockly / Interpreter setup
   */
}
