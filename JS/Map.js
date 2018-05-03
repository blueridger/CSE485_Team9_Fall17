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
  
  var originalPosition, originalDirection;
  var player;
  var playerTile;
  var batteryTile;
  var batteryMaxLife;
  if(batterySize === undefined) {
    batteryMaxLife = width * height * 25;
  }
  else {
	batteryMaxLife = batterySize;
  }
  var batteryLife = batteryMaxLife;
  var maxX = width;
  var maxY = height;
  var tileMap = new Array(maxY);
	
  for (var i = 0; i < maxY; i++) {
    tileMap[i] = new Array(maxX);
  }
	
  for (var i = 0; i < maxY; i++) {
    for (var j = 0; j < maxX; j++) {
      tileMap[i][j] = new Tile([i, j]);
    }
  }
  
  for(var i = 0; i < maxY; i++) {
    tileMap[i][0].setWall(3, true);
	tileMap[i][maxX - 1].setWall(1, true);
  }
  
  for(var i = 0; i < maxX; i++) {
    tileMap[0][i].setWall(0, true);
	tileMap[maxY - 1][i].setWall(2, true);
  }
  
  for(var i = 0; i < verticalWalls.length; i++) {
    if(verticalWalls[i]) { 
      tileMap[parseInt(i / (maxX - 1), 10)][i % (maxX - 1)].setWall(1, true);
      tileMap[parseInt(i / (maxX - 1), 10)][i % (maxX - 1) + 1].setWall(3, true);
    }
  }
	
  for(var i = 0; i < horizontalWalls.length; i++) {
    if(horizontalWalls[i]) {
      tileMap[parseInt(i / maxX, 10)][i % maxX].setWall(2, true);
      tileMap[parseInt(i / maxX, 10) + 1][i % maxX].setWall(0, true);
    }
  }
  
  if(playerPosition === undefined && playerDirection === undefined && batteryPosition === undefined) {
	var firstTileIndex, secondTileIndex;
    var numTiles = maxX * maxY;
    var adjacencyMatrix = constructAdjacencyMatrix();
	var maxShortestDist = -1;
    var shortestDistances = APD(adjacencyMatrix, numTiles);
    for(var i = 0; i < numTiles; i ++) {
      for(var j = 0; j < numTiles; j++) {
        if(shortestDistances[i][j] > maxShortestDist) {
          maxShortestDist = shortestDistances[i][j];
		  firstTileIndex = i;
		  secondTileIndex = j;
		}
      }
    }
	if(Math.floor(Math.random() * 2) === 0) {
      playerPosition = [parseInt(firstTileIndex / width, 10), firstTileIndex % width];
      batteryPosition = [parseInt(secondTileIndex / width, 10), secondTileIndex % width];
    }
    else {
      playerPosition = [parseInt(secondTileIndex / width, 10), secondTileIndex % width];
      batteryPosition = [parseInt(firstTileIndex / width, 10), firstTileIndex % width];
    }
	playerDirection = Math.floor(Math.random() * 4);
  }
  
  originalPosition = playerPosition;
  originalDirection = playerDirection;
  
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
    return getAdjacentTiles(index);
  }
	
  function getAdjacentTiles(index) {
    var tiles = new Array(4);
    tiles[Map.NORTH] = getTile([index[0] - 1, index[1]]);
    tiles[Map.EAST] = getTile([index[0], index[1] + 1]);
    tiles[Map.SOUTH] = getTile([index[0] + 1, index[1]]);
    tiles[Map.WEST] = getTile([index[0], index[1] - 1]);
    return tiles;
  }
  
  function APD(A, n) {
    var isCompleteGraph = true;
    var i = 0;
    var j = 0;
    while(isCompleteGraph) {
      if(i != j && A[i][j] === 0) {
        isCompleteGraph = false;
      }
      else if(j == n - 1) {
        if(i == n - 1) {
          return A;
        }
        else {
          j = 0;
          i++;
        }
      }
      else {
        j++;
      }
    }
    var Z = matrixMultiply(A, A);
    var B = new Array(n);
    for(i = 0; i < n; i++) {
      B[i] = new Array(n);
    }
    for(i = 0; i < n; i++) {
      for(j = 0; j < n; j++) {
        if(i != j && (A[i][j] === 1 || Z[i][j] > 0)) {
          B[i][j] = 1;
        }
        else {
          B[i][j] = 0;
        }
      }
    }
    var T = APD(B, n);
    var X = matrixMultiply(T, A);
    var degree = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
    for(i = 0; i < n; i++) {
      for(j = 0; j < n; j++) {
        degree[i] += A[i][j]; 
      }
    }
    var D = new Array(n);
    for(i = 0; i < n; i++) {
      D[i] = new Array(n);
    }
    for(i = 0; i < n; i++) {
      for(j = 0; j < n; j++) {
        if(X[i][j] >= (T[i][j] * degree[j])) {
          D[i][j] = 2 * T[i][j];
        }
        else {
          D[i][j] = 2 * T[i][j] - 1;
        }
      }
    }
    return D;
  }
  
  function constructAdjacencyMatrix() {
    var n = maxX * maxY;
    var matrix = new Array(n);
    for(var i = 0; i < n; i++) {
      matrix[i] = new Array(n);
    }
    for(var r = 0; r < n; r++) {
      for(var c = 0; c < n; c++) {
        if(matrix[r][c] === undefined) {
          matrix[r][c] = 0;
          matrix[c][r] = 0;
          if(r != c) {
            var adjacentTiles = getAdjacentTiles([parseInt(r/maxX, 10),r%maxX]);
            for(var j = 0; j < 4; j++) {
              if(adjacentTiles[j] == tileMap[parseInt(c/maxX, 10)][c%maxX]) {
                if(tileMap[parseInt(r/maxX, 10)][r%maxX].getWalls()[j] === false) {
                  matrix[r][c] = 1;
                  matrix[c][r] = 1;
                }
              }
            }
          }
        }
      }
    }
	return matrix;
  }
  
  function matrixMultiply(a, b) {
    var aNumRows = a.length; 
    var aNumCols = a[0].length; 
    var bNumRows = b.length; 
    var bNumCols = b[0].length;
    var matrix = new Array(aNumRows);
    for (var r = 0; r < aNumRows; ++r) {
      matrix[r] = new Array(bNumCols);
      for (var c = 0; c < bNumCols; ++c) {
        matrix[r][c] = 0;
        for (var i = 0; i < aNumCols; ++i) {
          matrix[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return matrix;
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
    playerTile = tileMap[originalPosition[0]][originalPosition[1]];
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