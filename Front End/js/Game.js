function CallGUI(){
	GUI.setup();
}

var GUI = {
	gamePieces : {
		robot: null,
		walls: [],
		battery: [],
		myScore: 0,
		gameArea: null
	},

	robotImages : {
		north: "ship_north.png",
		south: "ship_south.png",
		east: "ship_east.png",
		west: "ship_west.png"
	},

	gameSettings : {
		columns: 12,
		rows: 6,
		width: 500,
		height: 500
	},
	
	setup : function(map) {
		GUI.gamePieces.gameArea = document.getElementById("GameArea");
	
		GUI.getGameDimensions(GUI.gamePieces.gameArea);
		var width = GUI.gameSettings.width/GUI.gameSettings.columns;
		var height = GUI.gameSettings.height/GUI.gameSettings.rows;
		var startcol = 2;
		var startrow = 2;

		GUI.gamePieces.robot = new GUI.component(width, height, width*startcol, height*startrow, "robot");
		GUI.gamePieces.robot.facing = 'right';
		GUI.gameArea.start();
	},

	getGameDimensions : function(elem) {
		var tmpWidth = elem.clientWidth;
	
		for(var i = tmpWidth; i > tmpWidth-GUI.gameSettings.columns; i--)
		{
			if(i%GUI.gameSettings.columns == 0)
			{
				tmpWidth = i;
			}
		}
	
		GUI.gameSettings.width = tmpWidth;
	},


	gameArea : {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = GUI.gameSettings.width;
			this.canvas.height = GUI.gameSettings.height;
			this.context = this.canvas.getContext("2d");

			GUI.gamePieces.gameArea.appendChild(this.canvas);
			GUI.updateGameArea();
		},

		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	},

	drawGrid : function(){
		var ctx = GUI.gameArea.context;
		var height = GUI.gameArea.canvas.height;
		var width = GUI.gameArea.canvas.width;
	
		ctx.beginPath();
	
		for (var x = 0; x <= height; x += height/GUI.gameSettings.rows) {
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		for (var y = 0; y <= width; y += width/GUI.gameSettings.columns) {
			ctx.moveTo(y,0);
			ctx.lineTo(y,height);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	},

	drawMap : function(map){
		var ctx = GUI.gameArea.context;
		var height = GUI.gameArea.canvas.height;
		var width = GUI.gameArea.canvas.width;
		ctx.beginPath();

	
		for (var x = 0; x <= height; x += height/GUI.gameSettings.rows) {
			for (var y = 0; y <= width; y += width/GUI.gameSettings.columns) {
				ctx.moveTo(y,0);
				ctx.lineTo(y,height);
			}
		
			ctx.moveTo(0,x);
			ctx.lineTo(width,x);
		}

		ctx.strokeStyle = "#e2e2e2";
		ctx.stroke();
	},

	component : function(width, height, x, y, type){
		this.type = type;
		this.score = 0;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;

		this.update = function() {
			ctx = GUI.gameArea.context;
			if (this.type == "wall") {
				//TODO: wall script
			} else if (this.type == "robot"){
				var img = new Image();
			
				img.onload = function(){
					ctx.drawImage(img,GUI.gamePieces.robot.x, GUI.gamePieces.robot.y,width, height);
				}
			
				switch(GUI.gamePieces.robot.facing){
					case "right":
						img.src = "images/" + GUI.robotImages.east;
						break;
					case "left":
						img.src = "images/" + GUI.robotImages.west;
						break;
					case "up":
						img.src = "images/" + GUI.robotImages.north;
						break;
					case "down":
						img.src = "images/" + GUI.robotImages.south;
						break;
				}
			
			}
		}

		this.hitWall = function() {
			var bottom = GUI.gameArea.canvas.height - this.height;
			if (this.y > bottom) {
				alert("Hit Bottom");
				this.y = bottom;
			}

			var top = 0;
			if (this.y < top) {
				alert("Hit Top");
				this.y = 0;
			}

			var right = GUI.gameArea.canvas.width - this.width;
			if (this.x > right) {
				alert("Hit Right");
				this.x = right;
			}

			var left = 0;
			if (this.x < left) {
				alert("Hit Left");
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
	},


	updateGameArea : function() {
		var x, height, gap, minHeight, maxHeight, minGap, maxGap;

		for (i = 0; i < GUI.gamePieces.walls.length; i += 1) {
			if (GUI.gamePieces.robot.crashWith(GUI.gamePieces.walls[i])) {
				return;
			}
		}

		GUI.gameArea.clear();
		/*if (gameArea.frameNo == 1 || everyinterval(150)) {
			x = gameArea.canvas.width;
			minHeight = 20;
			maxHeight = 200;
			height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			minGap = 50;
			maxGap = 200;
			gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			GUI.gamePieces.walls.push(new component(10, height, "green", x, 0));
			GUI.gamePieces.walls.push(new component(10, x - height - gap, "green", x, height + gap));
		}
		for (i = 0; i < GUI.gamePieces.walls.length; i += 1) {
			GUI.gamePieces.walls[i].x += -1;
			GUI.gamePieces.walls[i].update();
		}*/

		GUI.drawGrid();
		GUI.gamePieces.robot.hitWall();
		GUI.gamePieces.robot.update();
	},

	moveForward : function(event){
		var moveAmtX = GUI.gameSettings.width/GUI.gameSettings.columns;
		var moveAmtY = GUI.gameSettings.height/GUI.gameSettings.rows;

		switch(GUI.gamePieces.robot.facing)
		{
		  //left
		  case 'left':
			GUI.gamePieces.robot.x = GUI.gamePieces.robot.x-moveAmtX;
			break;

		  //up
		  case 'up':
			GUI.gamePieces.robot.y = GUI.gamePieces.robot.y-moveAmtY;
			break;

		  //right
		  case 'right':
			GUI.gamePieces.robot.x = GUI.gamePieces.robot.x+moveAmtX;
			break;

		  //down
		  case 'down':
			GUI.gamePieces.robot.y = GUI.gamePieces.robot.y+moveAmtY;
			break;
		}
		GUI.updateGameArea();
	},

	moveBackward : function(event){
		var moveAmtX = GUI.gameSettings.width/GUI.gameSettings.columns;
		var moveAmtY = GUI.gameSettings.height/GUI.gameSettings.rows;

		switch(GUI.gamePieces.robot.facing)
		{
		  //left
		  case 'left':
			GUI.gamePieces.robot.x = GUI.gamePieces.robot.x+moveAmtX;
			break;

		  //up
		  case 'up':
			GUI.gamePieces.robot.y = GUI.gamePieces.robot.y+moveAmtY;
			break;

		  //right
		  case 'right':
			GUI.gamePieces.robot.x = GUI.gamePieces.robot.x-moveAmtX;
			break;

		  //down
		  case 'down':
			GUI.gamePieces.robot.y = GUI.gamePieces.robot.y-moveAmtY;
			break;
		}
		GUI.updateGameArea();
	  },

	  turnLeft : function(){
		switch(GUI.gamePieces.robot.facing)
		{
		  //left
		  case 'left':
			GUI.gamePieces.robot.facing = 'down';
			break;

		  //up
		  case 'up':
			GUI.gamePieces.robot.facing = 'left';
			break;

		  //right
		  case 'right':
			GUI.gamePieces.robot.facing = 'up';
			break;

		  //down
		  case 'down':
			GUI.gamePieces.robot.facing = 'right';
			break;
		}
		GUI.updateGameArea();
	  },

	turnRight : function(){
		switch(GUI.gamePieces.robot.facing)
		{
		  //left
		  case 'left':
			GUI.gamePieces.robot.facing = 'up';
			break;

		  //up
		  case 'up':
			GUI.gamePieces.robot.facing = 'right';
			break;

		  //right
		  case 'right':
			GUI.gamePieces.robot.facing = 'down';
			break;

		  //down
		  case 'down':
			GUI.gamePieces.robot.facing = 'left';
			break;
		}
		GUI.updateGameArea();
	}

};


/*function changePosition(event)
{
	var x = event.keyCode;
	var moveAmtX = GUI.gameSettings.width/GUI.gameSettings.columns;
	var moveAmtY = GUI.gameSettings.height/GUI.gameSettings.rows;

	switch(x)
	{
		//left
		case 37:
			gamePieces.robot.x = gamePieces.robot.x-moveAmtX;
			break;

		//up
		case 38:
			gamePieces.robot.y = gamePieces.robot.y-moveAmtY;
			break;

		//right
		case 39:
			gamePieces.robot.x = gamePieces.robot.x+moveAmtX;
			break;

		//down
		case 40:
			gamePieces.robot.y = gamePieces.robot.y+moveAmtY;
			break;
	}
}*/
