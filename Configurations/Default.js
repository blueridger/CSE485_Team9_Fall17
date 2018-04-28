//DEFAULT SETTINGS
//You may edit, but do NOT rename or delete file

function InitializeGame() {
  var gameSettings = {
    debug: true,
    //mapSource expects array of string relative paths to use for map loading, will randomly generate map if null.
    //mapSource: ["Maps/TestSet/ExampleMap.json"],
    mapSource: null, 
    numberOfLevels: 6 //only used if mapSource is null
  }
  blocklyCustomSettings = {
    enableWhile: false,
    enableDoWhile: false,
    enableIfElse: false,
    maxLevelOfNesting: 2  // 1 means no nested if or loop structures.
  }
  return new GameEngine(gameSettings);
}