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
    player = hasBattery;
  };
  
  this.setWall = function(wallIndex, hasWall) {
    walls[wallIndex] = hasWall;
  };
}

function Map(verticalWalls, horizontalWalls, playerPosition, playerDirection, batteryPosition) {
  var player;
  var playerTile;
  var batteryTile;
  var tileMap = new Array(3); //TODO allow dynamic sizing
	
  for (var i = 0; i < 3; i++) {
    tileMap[i] = new Array(6);
  }
	
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 6; j++) {
      tileMap[i][j] = new Tile([i, j]);
    }
  }
	
  for(var i = 0; i < verticalWalls.length; i++) {
    if(verticalWalls[i]) {
      if(i%7>0) {
        tileMap[parseInt((i-parseInt(i/7, 10)-1)/6, 10)][(i-parseInt(i/7, 10)-1)%6].setWall(1, true);
      }
      if((i+1)%7>0) {
        tileMap[parseInt((i-parseInt(i/7, 10))/6, 10)][(i-parseInt(i/7, 10))%6].setWall(3, true);
      }
    }
  }
	
  for(var i = 0; i < horizontalWalls.length; i++) {
    if(horizontalWalls[i]) {
      if(i%4>0) {
        tileMap[parseInt((6*((i-parseInt(i/4, 10)-1)%3)+parseInt((i-parseInt(i/4, 10)-1)/3, 10))/6, 10)][(6*((i-parseInt(i/4, 10)-1)%3)+parseInt((i-parseInt(i/4, 10)-1)/3, 10))%6].setWall(2, true);
      }
      if((i+1)%4>0) {
        tileMap[parseInt((6*((i-parseInt(i/4, 10))%3)+parseInt((i-parseInt(i/4, 10))/3, 10))/6, 10)][(6*((i-parseInt(i/4, 10))%3)+parseInt((i-parseInt(i/4, 10))/3, 10))%6].setWall(0, true);
      }
    }
  }
  
  playerTile = tileMap[playerPosition[0]][playerPosition[1]];
  batteryTile = tileMap[batteryPosition[0]][batteryPosition[1]];
  player = new Player(playerDirection, playerTile);
	
  playerTile.setPlayer(true);
  batteryTile.setBattery(true);
  
  this.getTile = function(index) {
    return tileMap[index[0]][index[1]];
  };
	
  this.getAdjacentTiles = function(index) {
    var tiles = new Array(4);
    tiles[0] = tileMap[index[0] - 1][index[1]];
    tiles[1] = tileMap[index[0]][index[1] + 1];
    tiles[2] = tileMap[index[0] + 1][index[1]];
    tiles[3] = tileMap[index[0]][index[1] - 1];
    return tiles;
  };
  
  this.movePlayerForward = function() {
    if (!playerTile.getWalls()[player.front()]) {
      playerTile.setPlayer(false);
      playerTile = this.getAdjacentTiles(playerTile.getIndex())[player.front()];
      playerTile.setPlayer(true);
      return true;
    } 
    else {
      return false;
    }
  };
  
  this.movePlayerBackward = function() {
    if (!playerTile.getWalls()[player.rear()]) {
      playerTile.setPlayer(false);
      playerTile = this.getAdjacentTiles(playerTile.getIndex())[player.rear()];
      playerTile.setPlayer(true);
      return true;
    } 
    else {
      return false;
    }
  };
  
  this.turnPlayerRight = function() {
    player.setDirection(player.right());
  };
  
  this.turnPlayerLeft = function() {
    player.setDirection(player.left());
  };
  
  this.openFront = function() {
    return !playerTile.getWalls()[player.front()];
  };
  
  this.openRear = function() {
    return !playerTile.getWalls()[player.rear()];
  };
  
  this.openRight = function() {
    return !playerTile.getWalls()[player.right()];
  };
  
  this.openLeft = function() {
    return !playerTile.getWalls()[player.left()];
  };
}