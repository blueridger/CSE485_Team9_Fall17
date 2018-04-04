function Player(initialDirection) {
  var direction = initialDirection;

  this.setDirection = function(newDirection) {
    direction = newDirection;
  };
  
  this.front = function() {
    return direction;
  };
  
  this.rear = function() {
    return (direction + 2) % 4;
  };
  
  this.right = function() {
    return (direction + 1) % 4;
  };
  
  this.left = function() {
    return (direction + 3) % 4;
  };
}

function Tile(tileIndex) {
  var index = tileIndex.slice(0, 2);
  var player = false;
  var battery = false;
  var walls = [false, false, false, false];
  this.getIndex = function() {
    return index;
  };
  
  this.containsPlayer = function() {
    return player;
  };
  
  this.containsBattery = function() {
    return battery;
  };
  
  this.getWalls = function() {
    return walls;
  };
  
  this.setPlayer = function(hasPlayer) {
    player = hasPlayer;
  };
  
  this.setBattery = function(hasBattery) {
    battery = hasBattery;
  };
  
  this.setWall = function(wallIndex, hasWall) {
    walls[wallIndex] = hasWall;
  };
}

function Map(width, height, verticalWalls, horizontalWalls, playerPosition, playerDirection, batteryPosition, batterySize) {
  
  this.constructor.NORTH = 0;
  this.constructor.EAST = 1;
  this.constructor.SOUTH = 2;
  this.constructor.WEST = 3;
  
  var originalPosition = playerPosition;
  var originalDirection = playerDirection;
  var player;
  var playerTile;
  var batteryTile;
  var batteryMaxLife = batterySize;
  var batteryLife = batteryMaxLife;
  var maxX = width;
  var maxY = height;
  var tileMap = new Array(maxY); //TODO allow dynamic sizing
	
  for (var i = 0; i < maxY; i++) {
    tileMap[i] = new Array(maxX);
  }
	
  for (var i = 0; i < maxY; i++) {
    for (var j = 0; j < maxX; j++) {
      tileMap[i][j] = new Tile([i, j]);
    }
  }
	
  for(var i = 0; i < verticalWalls.length; i++) {
    if(verticalWalls[i]) {
      if(i%(maxX+1)>0) {
        tileMap[parseInt((i-parseInt(i/(maxX+1), 10)-1)/maxX, 10)][(i-parseInt(i/(maxX+1), 10)-1)%maxX].setWall(1, true);
      }
      if((i+1)%(maxX+1)>0) {
        tileMap[parseInt((i-parseInt(i/(maxX+1), 10))/maxX, 10)][(i-parseInt(i/(maxX+1), 10))%maxX].setWall(3, true);
      }
    }
  }
	
  for(var i = 0; i < horizontalWalls.length; i++) {
    if(horizontalWalls[i]) {
      if(i%(maxY+1)>0) {
        tileMap[parseInt((maxX*((i-parseInt(i/(maxY+1), 10)-1)%maxY)+parseInt((i-parseInt(i/(maxY+1), 10)-1)/maxY, 10))/maxX, 10)][(maxX*((i-parseInt(i/(maxY+1), 10)-1)%maxY)+parseInt((i-parseInt(i/(maxY+1), 10)-1)/maxY, 10))%maxX].setWall(2, true);
      }
      if((i+1)%(maxY+1)>0) {
        tileMap[parseInt((maxX*((i-parseInt(i/(maxY+1), 10))%maxY)+parseInt((i-parseInt(i/(maxY+1), 10))/maxY, 10))/maxX, 10)][(maxX*((i-parseInt(i/(maxY+1), 10))%maxY)+parseInt((i-parseInt(i/(maxY+1), 10))/maxY, 10))%maxX].setWall(0, true);
      }
    }
  }
  
  playerTile = tileMap[playerPosition[0]][playerPosition[1]];
  batteryTile = tileMap[batteryPosition[0]][batteryPosition[1]];
  player = new Player(playerDirection, playerTile);
	
  playerTile.setPlayer(true);
  batteryTile.setBattery(true);
  
  this.getDirection = function() { return player.front(); };
  this.getWidth = function() { return maxX; };
  this.getHeight = function() { return maxY; };
  
  this.getTile = function(index) { return getTile(index); };
  function getTile(index) {
    if (index[0] < 0 || index[1] < 0 || index[0] >= maxY || index[1] >= maxX) return null;
    return tileMap[index[0]][index[1]];
  }
	
  this.getAdjacentTiles = function(index) {
    var tiles = new Array(4);
    tiles[Map.NORTH] = getTile([index[0] - 1, index[1]]);
    tiles[Map.EAST] = getTile([index[0], index[1] + 1]);
    tiles[Map.SOUTH] = getTile([index[0] + 1, index[1]]);
    tiles[Map.WEST] = getTile([index[0], index[1] - 1]);
    return tiles;
  }
  
  this.movePlayerForward = function() {
    batteryLife--;
    if (!playerTile.getWalls()[player.front()]) {
      debug("No wall in front. Moving.");
      playerTile.setPlayer(false);
      playerTile = this.getAdjacentTiles(playerTile.getIndex())[player.front()];
      playerTile.setPlayer(true);
      return true;
    } 
    else {
      return false;
    }
  }
  
  this.movePlayerBackward = function() {
    batteryLife--;
    if (!playerTile.getWalls()[player.rear()]) {
      playerTile.setPlayer(false);
      playerTile = this.getAdjacentTiles(playerTile.getIndex())[player.rear()];
      playerTile.setPlayer(true);
      return true;
    } 
    else {
      return false;
    }
  }
  
  this.turnPlayerRight = function() {
    batteryLife--;
    player.setDirection(player.right());
  }
  
  this.turnPlayerLeft = function() {
    batteryLife--;
    player.setDirection(player.left());
  }
  
  this.openFront = function() {
    batteryLife--;
    return !playerTile.getWalls()[player.front()];
  }
  
  this.openRear = function() {
    batteryLife--;
    return !playerTile.getWalls()[player.rear()];
  }
  
  this.openRight = function() {
    batteryLife--;
    return !playerTile.getWalls()[player.right()];
  }
  
  this.openLeft = function() {
    batteryLife--;
    return !playerTile.getWalls()[player.left()];
  }
  
  this.resetLevel = function() {
    playerTile.setPlayer(false);
    playerTile = getTile(originalPosition);
    playerTile.setPlayer(true);
    player.setDirection(originalDirection);
    batteryLife = batteryMaxLife;
  }
  
  this.isWin = function() {
    return batteryTile == playerTile;
  }
  
  this.isDead = function() {
    return batteryLife <= 0;
  }
}