function GenerateMap(width, height) {
	var i;
	var randomNum;
	var wallIndex;
	var leftTileIndex;
	var topTileIndex;
	var playerPosition;
	var playerDirection;
	var batteryPosition;
	var batterySize;
	
	function Tile() {
		var parent;
		var rank;
		
		this.getParent = function() {
			return parent;
		}
		this.setParent = function(value) {
			parent = value;
		}
		this.getRank = function() {
			return rank;
		}
		this.setRank = function(value) {
			rank = value;
		}
	}
	
	//Makes a new set consisting of the given tile
	function MakeSet(tile) {
		tile.setParent(tile);
		tile.setRank(0);
	}
	
	//Finds the root of the tree containing the tile, and sets the root as the tile's parent
	function Find(tile) {
		if(tile.getParent() !== tile) {
			tile.setParent(Find(tile.getParent()));
		}
		return tile.getParent();
	}
	
	//Attempts to merge the sets containing xTile and yTile. Returns 
	//false if xTile and yTile are already in the same set and returns 
	//true if the sets containing xTile and yTile were successfully merged
	function Union(xTile, yTile) { 
		var xRoot = Find(xTile);
		var yRoot = Find(yTile);
		if(xRoot === yRoot) {
			return false;
		}
		if(xRoot.getRank() <= yRoot.getRank()) {
			xRoot.setParent(yRoot);
			xRoot.setRank(xRoot.getRank() + 1);
		}
		else {
			yRoot.setParent(xRoot);
			yRoot.setRank(yRoot.getRank() + 1);
		}
		return true;
	}
	
	var numTiles = width * height;
	var tileSet = new Array(numTiles);
	for(i = 0; i < numTiles; i++) {
		tileSet[i] = new Tile();
		MakeSet(tileSet[i]);
	}
	var numWalls = width + (2 * width + 1) * height;
	var wallArray = new Array(numWalls);
	for(i = 0; i < numWalls; i++) {
		wallArray[i] = i;
	}
	var randomVWalls = new Array(height * (width + 1));
	for(i = 0; i < randomVWalls.length; i++) {
		randomVWalls[i] = true;
	}
	var randomHWalls = new Array(width * (height + 1));
	for(i = 0; i < randomHWalls.length; i++) {
		randomHWalls[i] = true;
	}
	for(i = numWalls; i > 0; i--) {
		wallIndex = wallArray.splice(Math.floor((Math.random() * i)), 1);
		if(wallIndex % (2 * width + 1) >= width) { //Check if wall is vertical
			if((wallIndex % (2 * width + 1)) % width !== 0) { //Check if wall is not a border. Do nothing if it is.
				leftTileIndex = wallIndex - (width + 1 + parseInt(wallIndex / (2 * width + 1), 10) * (width + 1));
				randomVWalls[wallIndex - width * (parseInt(wallIndex / (2 * width + 1), 10) + 1)] = !Union(tileSet[leftTileIndex], tileSet[leftTileIndex + 1]);
			}
		}
		else { //wall is horizontal
			if(wallIndex >= width && wallIndex < (numWalls - width)) { //Check if wall is not a border. Do nothing if it is.
				topTileIndex = wallIndex - (2 * width + 1 + (parseInt(wallIndex / (2 * width + 1), 10) - 1) * (width + 1));
				randomHWalls[topTileIndex + height * (topTileIndex % width) - (width - 1) * parseInt(topTileIndex / width, 10) + 1] = !Union(tileSet[topTileIndex], tileSet[topTileIndex + width]);
			}
		}
	}
	randomNum = Math.floor(Math.random() * numTiles);
	playerPosition = [parseInt(randomNum / width, 10), randomNum % width];
	batteryPosition = playerPosition;
	while(batteryPosition[0] == playerPosition[0] && batteryPosition[1] == playerPosition[1]) {
		randomNum = Math.floor(Math.random() * numTiles);
		batteryPosition = [parseInt(randomNum / width, 10), randomNum % width];
	}
	playerDirection = Math.floor(Math.random() * 4);
	batterySize = 20;
	var randomMap = new Map(width, height, randomVWalls, randomHWalls, playerPosition, playerDirection, batteryPosition, batterySize);
	return randomMap;
}
