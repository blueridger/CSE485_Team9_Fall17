function player() {
	this.direction = 0;
	this.tile = null;

  //TODO sub these methods into the GameEngine
  this.front = function () {
    return this.direction;
  }

  this.rear = function () {
    return (this.direction + 2) % 4;
  }

  this.right = function () {
    return (this.direction + 1) % 4;
  }

  this.left = function () {
    return (this.direction + 3) % 4;
  }
}

function Tile() {
	this.index = new Array(2);
	this.player = false;
	this.battery = false;
	this.walls = [false, false, false, false];
}

function Map(VerticalWalls, HorizontalWalls, Player, Battery) {
  this.player = new Player(); //TODO populate this info, incorporate into GameEng private methods
	this.playerTile = null;
	this.batteryTile = null;
	this.tileMap = new Array(3); //TODO allow dynamic sizing
	
	for (var i = 0; i < 3; i++) {
		this.tileMap[i] = new Array(6);
	}
	
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 6; j++) {
			this.tileMap[i][j] = new Tile();
			this.tileMap[i][j].index = [i, j];
		}
	}
	
	for(var i = 0; i < VerticalWalls.length; i++) {
		if(VerticalWalls[i]) {
			if(i%7>0) {
				this.tileMap[parseInt((i-parseInt(i/7)-1)/6)][(i-parseInt(i/7)-1)%6].walls[1] = true;
			}
			if((i+1)%7>0) {
				this.tileMap[parseInt((i-parseInt(i/7))/6)][(i-parseInt(i/7))%6].walls[3] = true;
			}
		}
	}
	
	for(var i = 0; i < HorizontalWalls.length; i++) {
		if(HorizontalWalls[i]) {
			if(i%4>0) {
				this.tileMap[parseInt((6*((i-parseInt(i/4)-1)%3)+parseInt((i-parseInt(i/4)-1)/3))/6)][(6*((i-parseInt(i/4)-1)%3)+parseInt((i-parseInt(i/4)-1)/3))%6].walls[2] = true;
			}
			if((i+1)%4>0) {
				this.tileMap[parseInt((6*((i-parseInt(i/4))%3)+parseInt((i-parseInt(i/4))/3))/6)][(6*((i-parseInt(i/4))%3)+parseInt((i-parseInt(i/4))/3))%6].walls[0] = true;
			}
		}
	}
	
	this.playerTile = this.tileMap[Player[0]][Player[1]];
	this.batteryTile = this.tileMap[Battery[0]][Battery[1]];
	
	this.tileMap[playerTile[0]][playerTile[1]].player = true;
	this.tileMap[batteryTile[0]][batteryTile[1]].battery = true;
	
	this.getTileAdjacentTiles = function(index) {
		var tiles = new Array(4);
		tiles[0] = this.tileMap[index[0] - 1][index[1]];
		tiles[1] = this.tileMap[index[0]][index[1] + 1];
		tiles[2] = this.tileMap[index[0] + 1][index[1]];
		tiles[3] = this.tileMap[index[0]][index[1] - 1];
		return tiles;
	}
}
