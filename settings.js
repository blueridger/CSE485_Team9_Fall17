function InitializeGame() {
  var gameEngineSettings = {
    debug: true,
    mapSource: null //string to use for map loading, will randomly generate map if null.
  }
  blocklyCustomSettings = {
    enableWhile: true,
    enableDoWhile: true,
    enableIfElse: false
  }
  return new GameEngine(gameEngineSettings);
}