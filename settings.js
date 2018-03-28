function InitializeGame() {
  var gameEngineSettings = {
    debug: true,
    mapSource: null //string to use for map loading, will randomly generate map if null.
  }
  blocklyCustomSettings = {
    enableWhile: false;
    enableDoWhile: false;
    enableIfElse: true;
  }
  return new GameEngine(gameEngineSettings);
}