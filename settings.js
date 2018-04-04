function InitializeGame() {
  var gameEngineSettings = {
    debug: true,
    mapSource: null, //string to use for map loading, will randomly generate map if null.
    numberOfLevels: 1
  }
  blocklyCustomSettings = {
    enableWhile: false,
    enableDoWhile: false,
    enableIfElse: false
  }
  return new GameEngine(gameEngineSettings);
}