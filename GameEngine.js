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
  
  //End Main
  //Start Private Methods
  
  function setupInterpreter() {
    
  }
  
  function moveForward() {
    
  }
  
  //End Private Methods
  //Start Privileged Methods
  
  this.callback = function{
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
