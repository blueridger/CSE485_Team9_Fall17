var gamePieces = {
	robot: null,
    walls: [],
	battery: [],
	myScore: 0
}

var gameSettings = {
	columns: 6,
	rows: 6,
	width: 540,
	height: 540
}

function startGame() {
	var width = gameSettings.width/gameSettings.columns;
	var height = gameSettings.height/gameSettings.rows;
	var startcol = 2;
	var startrow = 2;



    gamePieces.robot = new component(width, height, "red", width*startcol, height*startrow);
    gamePieces.robot.facing = 'right';
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = gameSettings.width;
        this.canvas.height = gameSettings.height;
        this.context = this.canvas.getContext("2d");
				var gArea = document.getElementById("GameArea");
        gArea.appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 5);

        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var drawGrid = function(){
	var ctx = myGameArea.context;
	var height = myGameArea.canvas.height;
	var width = myGameArea.canvas.width;
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

var component = function(width, height, color, x, y, type){
	this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

	this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            var img = new Image();
            img.src = "images/pacman.gif";
            ctx.drawImage(img,this.x, this.y,this.width, this.height)
        }
    }

	this.newPos = function() {
        this.hitWall();
    }
    this.hitWall = function() {
        var bottom = myGameArea.canvas.height - this.height;
        if (this.y > bottom) {
			alert("Hit Bottom");
            this.y = bottom;
        }

		var top = 0;
		if (this.y < top) {
			alert("Hit Top y: " + this.y + " top: " + top);
            this.y = 0;
        }

		var right = myGameArea.canvas.width - this.width;
        if (this.x > right) {
			alert("Hit right x: " + this.x + " right: " + right);
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
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < gamePieces.walls.length; i += 1) {
        if (gamePieces.robot.crashWith(gamePieces.walls[i])) {
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    /*if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        gamePieces.walls.push(new component(10, height, "green", x, 0));
        gamePieces.walls.push(new component(10, x - height - gap, "green", x, height + gap));
    }*/
    for (i = 0; i < gamePieces.walls.length; i += 1) {
        gamePieces.walls[i].x += -1;
        gamePieces.walls[i].update();
    }

	drawGrid();
    gamePieces.robot.newPos();
    gamePieces.robot.update();
}



var pMethods = {
  moveForward : function(event){
	var moveAmtX = gameSettings.width/gameSettings.columns;
	var moveAmtY = gameSettings.height/gameSettings.rows;

    switch(gamePieces.robot.facing)
    {
      //left
      case 'left':
        gamePieces.robot.x = gamePieces.robot.x-moveAmtX;
        break;

      //up
      case 'up':
        gamePieces.robot.y = gamePieces.robot.y-moveAmtY;
        break;

      //right
      case 'right':
        gamePieces.robot.x = gamePieces.robot.x+moveAmtX;
        break;

      //down
      case 'down':
        gamePieces.robot.y = gamePieces.robot.y+moveAmtY;
        break;
    }
  },

  moveBackword : function(event){
	var moveAmtX = gameSettings.width/gameSettings.columns;
	var moveAmtY = gameSettings.height/gameSettings.rows;

    switch(gamePieces.robot.facing)
    {
      //left
      case 'left':
        gamePieces.robot.x = gamePieces.robot.x+moveAmtX;
        break;

      //up
      case 'up':
        gamePieces.robot.y = gamePieces.robot.y+moveAmtY;
        break;

      //right
      case 'right':
        gamePieces.robot.x = gamePieces.robot.x-moveAmtX;
        break;

      //down
      case 'down':
        gamePieces.robot.y = gamePieces.robot.y-moveAmtY;
        break;
    }
  },

  turnLeft : function(){
    switch(gamePieces.robot.facing)
    {
      //left
      case 'left':
        gamePieces.robot.facing = 'down';
        break;

      //up
      case 'up':
        gamePieces.robot.facing = 'left';
        break;

      //right
      case 'right':
        gamePieces.robot.facing = 'up';
        break;

      //down
      case 'down':
        gamePieces.robot.facing = 'right';
        break;
    }
  },

  turnRight : function(){
    switch(gamePieces.robot.facing)
    {
      //left
      case 'left':
        gamePieces.robot.facing = 'up';
        break;

      //up
      case 'up':
        gamePieces.robot.facing = 'right';
        break;

      //right
      case 'right':
        gamePieces.robot.facing = 'down';
        break;

      //down
      case 'down':
        gamePieces.robot.facing = 'left';
        break;
    }
  }
};

function moveForward()
{
	pMethods.moveForward();
}

function moveBackword()
{
	pMethods.moveBackword();
}

function turnLeft()
{
	pMethods.turnLeft();
}

function turnRight()
{
	pMethods.turnRight();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function changePosition(event)
{
	var x = event.keyCode;
	var moveAmtX = gameSettings.width/gameSettings.columns;
	var moveAmtY = gameSettings.height/gameSettings.rows;

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
}
