function InitializeGame() {
  var gameSettings = {
    debug: true,
    //mapSource expects array of string relative paths to use for map loading, will randomly generate map if null.
    mapSource: ["Maps/TestSet/ExampleMap.json"],
    numberOfLevels: 3
  }
  blocklyCustomSettings = {
    enableWhile: false,
    enableDoWhile: false,
    enableIfElse: false
  }
  return new GameEngine(gameSettings);
}