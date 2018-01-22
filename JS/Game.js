function CallGUI(){
	setup();
}

function GUI(){
	var gameArea = null;
	
	//All Game Variables
	var gElems = {
		robot: null,
		walls: [],
		battery: [],
		myScore: 0,
		gameArea: null
	};

	//Used for the time being to update position
	var robotImages = {
		north: "ship_north.png",
		south: "ship_south.png",
		east: "ship_east.png",
		west: "ship_west.png"
	};

	var gameSettings = {
		columns: 12,
		rows: 6,
		width: 500,
		height: 500
	};
	
	this.setup = function(map) {
		alert(map.playerPos);
		gElems.gameArea = document.getElementById("GameArea");
	
		getGameDimensions(gElems.gameArea);
		var width = gameSettings.width/gameSettings.columns;
		var height = gameSettings.height/gameSettings.rows;
		var startcol = 2;
		var startrow = 2;

		gElems.robot = new component(width, height, width*startcol, height*startrow, "robot");
		gElems.robot.facing = 'right';
		gameArea.start();
		this.updateGameArea();
	}
	
	this.updateGameArea = function() {
		gameArea.clear();

		drawGrid();
		gElems.robot.hitWall();
		gElems.robot.update();
	}

	var getGameDimensions = function(elem) {
		var tmpWidth = elem.clientWidth;
	
		for(var i = tmpWidth; i > tmpWidth-gameSettings.columns; i--)
		{
			if(i%gameSettings.columns == 0)
			{
				tmpWidth = i;
			}
		}
	
		gameSettings.width = tmpWidth;
	}


	gameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = gameSettings.width;
			this.canvas.height = gameSettings.height;
			this.context = this.canvas.getContext("2d");

			gElems.gameArea.appendChild(this.canvas);
			
		},

		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	function drawGrid(){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
	
		ctx.beginPath();
	
		for (var x = 0; x <= height; x += height/gameSettings.rows) {
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		for (var y = 0; y <= width; y += width/gameSettings.columns) {
			ctx.moveTo(y,0);
			ctx.lineTo(y,height);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	}

	function drawMap(map){
		var ctx = gameArea.context;
		var height = gameArea.canvas.height;
		var width = gameArea.canvas.width;
		ctx.beginPath();

	
		for (var x = 0; x <= height; x += height/gameSettings.rows) {
			for (var y = 0; y <= width; y += width/gameSettings.columns) {
				ctx.moveTo(y,0);
				ctx.lineTo(y,height);
			}
		
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	}

	var component = function(width, height, x, y, type){
		this.type = type;
		this.score = 0;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;

		this.update = function() {
			ctx = gameArea.context;
			if (this.type == "wall") {
				//TODO: wall script
			} else if (this.type == "robot"){
				var img = new Image();
			
				img.onload = function(){
					ctx.drawImage(img,gElems.robot.x, gElems.robot.y,width, height);
				}
			
				switch(gElems.robot.facing){
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


	this.moveForward = function(event){
		var moveAmtX = gameSettings.width/gameSettings.columns;
		var moveAmtY = gameSettings.height/gameSettings.rows;

		switch(gElems.robot.facing)
		{
		  //left
		  case 'left':
			gElems.robot.x = gElems.robot.x-moveAmtX;
			break;

		  //up
		  case 'up':
			gElems.robot.y = gElems.robot.y-moveAmtY;
			break;

		  //right
		  case 'right':
			gElems.robot.x = gElems.robot.x+moveAmtX;
			break;

		  //down
		  case 'down':
			gElems.robot.y = gElems.robot.y+moveAmtY;
			break;
		}
		this.updateGameArea();
	}

	this.moveBackward = function(event){
		var moveAmtX = gameSettings.width/gameSettings.columns;
		var moveAmtY = gameSettings.height/gameSettings.rows;

		switch(gElems.robot.facing)
		{
		  //left
		  case 'left':
			gElems.robot.x = gElems.robot.x+moveAmtX;
			break;

		  //up
		  case 'up':
			gElems.robot.y = gElems.robot.y+moveAmtY;
			break;

		  //right
		  case 'right':
			gElems.robot.x = gElems.robot.x-moveAmtX;
			break;

		  //down
		  case 'down':
			gElems.robot.y = gElems.robot.y-moveAmtY;
			break;
		}
		this.updateGameArea();
	  }

	this.turnLeft = function(){
		switch(gElems.robot.facing)
		{
		  //left
		  case 'left':
			gElems.robot.facing = 'down';
			break;

		  //up
		  case 'up':
			gElems.robot.facing = 'left';
			break;

		  //right
		  case 'right':
			gElems.robot.facing = 'up';
			break;

		  //down
		  case 'down':
			gElems.robot.facing = 'right';
			break;
		}
	  }

	this.turnRight = function(){
		switch(gElems.robot.facing)
		{
		  //left
		  case 'left':
			gElems.robot.facing = 'up';
			break;

		  //up
		  case 'up':
			gElems.robot.facing = 'right';
			break;

		  //right
		  case 'right':
			gElems.robot.facing = 'down';
			break;

		  //down
		  case 'down':
			gElems.robot.facing = 'left';
			break;
		}
	}

};


/*function changePosition(event)
{
	var x = event.keyCode;
	var moveAmtX = gameSettings.width/gameSettings.columns;
	var moveAmtY = gameSettings.height/gameSettings.rows;

	switch(x)
	{
		//left
		case 37:
			gElems.robot.x = gElems.robot.x-moveAmtX;
			break;

		//up
		case 38:
			gElems.robot.y = gElems.robot.y-moveAmtY;
			break;

		//right
		case 39:
			gElems.robot.x = gElems.robot.x+moveAmtX;
			break;

		//down
		case 40:
			gElems.robot.y = gElems.robot.y+moveAmtY;
			break;
	}
}*/
