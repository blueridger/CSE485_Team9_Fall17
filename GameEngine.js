//import GUI and map gen

function GameEngine() {
  //Start Properties
  
  this.callback = function{};
  
  var debug = true;
  var map = null;
  var gui = null;
  var interpreter = null;
  
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

  //return boolean true if level won
  this.step = function() {
    setupInterpreter();
  }
  
  //return boolean true if level won
  this.play = function() {
    callback = this.step;
    this.step();
  }

  //return void
  this.pause = function() {
    callback = function{};
  }

  //return void
  this.resetLevel = function() {

  }
  //End Privileged Methods
}
