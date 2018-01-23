function GUI(){
	//Private vars
	var robot = null;
	var map	= null;
	var score = 0;
	var gameAreaDiv = null;
	var gameArea = null;
	
	var robotImages = {
		north: "ship_north.png",
		south: "ship_south.png",
		east: "ship_east.png",
		west: "ship_west.png"
	};
	
	//defines defaults to use.
	var settings = {
		columns: 12,
		rows: 6,
		width: 500,
		height: 500
	};
	
	//Public vars
	
	
	
	//Public methods
	this.setup = function(map) {
		gameAreaDiv = document.getElementById("GameArea");
		getGameDimensions(gameAreaDiv);
		
		var width = settings.width/settings.columns;
		var height = settings.height/settings.rows;
		var startcol = 2;
		var startrow = 2;

		robot = new robotComponent(width, height, width*startcol, height*startrow,'right');
		
		gameArea.start();
		
		this.updateGameArea();
	}
	
	this.updateGameArea = function() {
		gameArea.clear();

		drawGrid();
		robot.hitWall();
		robot.update();
	}

	this.moveForward = function(event){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height/settings.rows;

		switch(robot.facing)
		{
		  //left
		  case 'left':
			robot.x = robot.x-moveAmtX;
			break;

		  //up
		  case 'up':
			robot.y = robot.y-moveAmtY;
			break;

		  //right
		  case 'right':
			robot.x = robot.x+moveAmtX;
			break;

		  //down
		  case 'down':
			robot.y = robot.y+moveAmtY;
			break;
		}
		this.updateGameArea();
	}

	this.moveBackward = function(event){
		var moveAmtX = settings.width/settings.columns;
		var moveAmtY = settings.height/settings.rows;

		switch(robot.facing)
		{
		  //left
		  case 'left':
			robot.x = robot.x + moveAmtX;
			break;

		  //up
		  case 'up':
			robot.y = robot.y + moveAmtY;
			break;

		  //right
		  case 'right':
			robot.x = robot.x - moveAmtX;
			break;

		  //down
		  case 'down':
			robot.y = robot.y - moveAmtY;
			break;
		}
		this.updateGameArea();
	  }

	this.turnLeft = function(){
		switch(robot.facing)
		{
		  //left
		  case 'left':
			robot.facing = 'down';
			break;

		  //up
		  case 'up':
			robot.facing = 'left';
			break;

		  //right
		  case 'right':
			robot.facing = 'up';
			break;

		  //down
		  case 'down':
			robot.facing = 'right';
			break;
		}
	  }

	this.turnRight = function(){
		switch(robot.facing)
		{
		  //left
		  case 'left':
			robot.facing = 'up';
			break;

		  //up
		  case 'up':
			robot.facing = 'right';
			break;

		  //right
		  case 'right':
			robot.facing = 'down';
			break;

		  //down
		  case 'down':
			robot.facing = 'left';
			break;
		}
	}
	
	
	
	
	//Private methods
	gameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = settings.width;
			this.canvas.height = settings.height;
			this.context = this.canvas.getContext("2d");

			gameAreaDiv.appendChild(this.canvas);
			
		},

		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
	
	
	var robotComponent = function(width, height, x, y, facing){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.facing = facing;

		this.update = function() {
			ctx = gameArea.context;
			var img = new Image();
			
			img.onload = function(){
				ctx.drawImage(img,robot.x, robot.y,width, height);
			}
			
			switch(robot.facing){
				case "right":
					img.src = "images/" + robotImages.east;
					break;
				case "left":
					img.src = "images/" + robotImages.west;
					break;
				case "up":
					img.src = "images/" + robotImages.north;
					break;
				case "down":
					img.src = "images/" + robotImages.south;
					break;
			}
		}

		this.hitWall = function() {
			var bottom = gameArea.canvas.height - this.height;
			if (this.y > bottom) {
				//alert("Hit Bottom");
				this.y = bottom;
			}

			var top = 0;
			if (this.y < top) {
				//alert("Hit Top");
				this.y = 0;
			}

			var right = gameArea.canvas.width - this.width;
			if (this.x > right) {
				//alert("Hit Right");
				this.x = right;
			}

			var left = 0;
			if (this.x < left) {
				//alert("Hit Left");
				this.x = 0;
			}
		}

		this.crashWith = function(otherobj) {
			var myleft = this.x;
			var myright = this.x + (this.width);
			var mytop = this.y;
			var mybottom = this.y + (this.height);
			var otherleft = otherobj.x;
			var otherright = otherobj.x + (otherobj.width);
			var othertop = otherobj.y;
			var otherbottom = otherobj.y + (otherobj.height);
			var crash = true;
			if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
				crash = false;
			}
			return crash;
		}
	}
	
	function getGameDimensions(elem) {
		var tmpWidth = elem.clientWidth;
	
		for(var i = tmpWidth; i > tmpWidth-settings.columns; i--)
		{
			if(i%settings.columns == 0)
			{
				tmpWidth = i;
			}
		}
	
		settings.width = tmpWidth;
	}
	
	function drawMap(map){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
		ctx.beginPath();

	
		for (var x = 0; x <= height; x += height/settings.rows) {
			for (var y = 0; y <= width; y += width/settings.columns) {
				ctx.moveTo(y,0);
				ctx.lineTo(y,height);
			}
		
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	}
	
	function drawGrid(){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
	
		ctx.beginPath();
	
		for (var x = 0; x <= height; x += height/settings.rows) {
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		for (var y = 0; y <= width; y += width/settings.columns) {
			ctx.moveTo(y,0);
			ctx.lineTo(y,height);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	}
}