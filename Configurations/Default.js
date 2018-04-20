//DEFAULT SETTINGS
//You may edit, but do NOT rename or delete file

function InitializeGame() {
  var gameSettings = {
    debug: true,
    //mapSource expects array of string relative paths to use for map loading, will randomly generate map if null.
    //mapSource: ["MapSets/TestSet/ExampleMap.json"],
    mapSource: null, 
    numberOfLevels: 2
  }
  blocklyCustomSettings = {
    enableWhile: false,
    enableDoWhile: false,
    enableIfElse: false
  }
  return new GameEngine(gameSettings);
}