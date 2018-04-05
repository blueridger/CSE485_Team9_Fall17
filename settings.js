function InitializeGame() {
  var gameSettings = {
    debug: true,
    mapSource: null, //string to use for map loading, will randomly generate map if null.
    numberOfLevels: 3
  }
  blocklyCustomSettings = {
    enableWhile: false,
    enableDoWhile: false,
    enableIfElse: false
  }
  return new GameEngine(gameSettings);
}