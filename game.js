//creation of the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var keys = [];
var friction = 0.8;
var gravity = 0.98;
var completed = false;
var myScore;
var frameNo=0;

//audios
var jumpsound = new Audio('jump_11.wav');
var shootsound = new Audio('shoot.wav');
var levelsound= new Audio('level1sound.mp3');
var gameo=false;

myScore = new component("10px", "Consolas", "white", 50, 20, "text");
var background=new Image();
background.src="level1back.png";


function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0; 
  this.x = x;
  this.y = y; 
  this.update = function() {
    ctx = context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}



///
///
///
/////
//player
var player = {
    x: canvas.width - 170,
    y: canvas.height - 60,
    width: 20,
    height: 20,
    speed: 5, 
    velX: 0,
    velY: 0,
    color: "#00FF00",
    jumping: false,
    grounded: false,
    jumpStrength: 7,
    draw: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

//buller only one now
var bullet = {
    x: 0,
    y: 0,
    startedat: 0,
    width: 5,
    height: 1,
    speed: 2,
    alive: false,
    color: "#00FF00",
    draw: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
    //move the buller for 50 
    move: function () {

        if (this.x < this.startedat + 50) {
            this.x += +this.speed;
        } else {
            this.alive = false;
        }

    }
}

//enemy only one now
var enemy = {
    x: canvas.width - 380,
    y: canvas.height - 260,
    startyposi: (canvas.width - 380),
    width: 20,
    height: 20,
    speed: 2,
    velX: 0,
    velY: 0,
    color: "#DC143C",
    dead: false,
    jumping: false,
    grounded: false,
    direction: 0, 
    jumpStrength: 7,
    info: function () {
        console.log(this.x);
        console.log(this.y);
        console.log((canvas.width - 380) - 120);
    },
    draw: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
    //move auto 
    move: function () {
        if (this.direction == 0) {//0 left to right
            if (this.x < ((canvas.width - 380) + 120 - this.width)) {
                this.x += +1;
            } else {
                //he reach the end of the platform
                this.direction = 1;//going back
            }
        }
        else{// 1 right to left
             if (this.x > ((canvas.width - 380) )) {
                this.x += -1;
            } else {
                this.direction = 0;
            } 
        }
    }



}


//where is the gate to go to the next level
var goal = {
    x: canvas.width - 80,
    y: 5,
    width: 30,
    height: 35,
    color: "#0098cb",
    draw: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}


//array of platforms, we could do the same with enemies, bullet,..
var platforms = [];
var platform_width = 120;
var platform_height = 10;
//adding and creating the platform
platforms.push({
    x: canvas.width - 170,
    y: 40,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width - 170,
    y: canvas.height - 50,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width - 380,
    y: canvas.height - 120,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width - 380,
    y: canvas.height - 240,
    width: platform_width,
    height: platform_height,
});

platforms.push({
    x: canvas.width - 590,
    y: canvas.height - 180,
    width: platform_width,
    height: platform_height,
});


//I removed the one for the floor 
/*
platforms.push({
	x: 0,
	y: canvas.height-5,
	width: canvas.width,
	height: platform_height
});*/

// Left Wall
platforms.push({
    x: -10,
    y: 0,
    width: 10,
    height: canvas.height
});

// Left Wall
platforms.push({
    x: canvas.width,
    x: canvas.width,
    y: 0,
    width: 10,
    height: canvas.height
});

// Floor
platforms.push({
    x: 0,
    y: -10,
    width: canvas.width,
    height: platform_height
});

//to start the game
document.body.addEventListener("keydown", function (event) {

    if (event.keyCode == 13 && !gameStarted) {
        startGame();
    }
    if (event.keyCode == 13 && completed) {
         levelsound.pause();

        dynamicallyLoadScript("level2.js");
       
        return;
    }
    if(event.keyCode == 13 && gameo)
       window.location.reload(false); 
    
    keys[event.keyCode] = true;

});

document.body.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});

intro_screen();

function intro_screen() {
    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("HTML5 Game", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter To Start", canvas.width / 2, canvas.height / 2 + 50);
}


function startGame() {
    gameStarted = true;
    clearCanvas();
    levelsound.play();
  //  ;
    requestAnimationFrame(loop);


}

//the player complete the level
function complete() {
    clearCanvas();
    completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Congrats! You've Won!", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter to Play Again", canvas.width / 2, canvas.height / 2 + 50);
    
   
}


//the player ddied
function gameover() {
    clearCanvas();
   // completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Game over! ", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Try again!", canvas.width / 2, canvas.height / 2 + 50);
    gameo=true;
}



function reset() {
    player.x = canvas.width - 170;
    player.y = canvas.height - 60;
    player.grounded = true;
    player.velY = 0;
    player.velX = 0;
    completed = false;
    
    requestAnimationFrame(loop);
}


//draw each platform in the caneva
function draw_platforms() {
    context.fillStyle = "#907020";

	for(var i = 0; i < platforms.length; i++){
		context.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
		context.lineWidth = 5;
		context.strokeStyle = "#90D030";
		context.strokeRect(platforms[i].x, platforms[i].y-2, platforms[i].width, 5);
	}
}


//loop the game 
//refresh the position of the element
//listen for the key
function loop() {


    clearCanvas();
     context.drawImage(background, 0, 0,640, 360);
    draw_platforms();
    
  
     myScore.text = "SCORE: " +frameNo;
  myScore.update();

    if (!enemy.dead) {
        enemy.draw();
        enemy.move();
    }

    player.draw();
    goal.draw();
    if (bullet.alive) {
        bullet.draw();
        bullet.move();
        if (collisionCheck(bullet, enemy))//check if the bullet touch an enemy
           {
               enemy.dead = true;//the enemy died
               bullet.alive=false;//hide the bullet
                 frameNo += 100;
           } 

        //bullet.alive=false;
    }

    //enemy.move();
    if (keys[38]) {
        if (!player.jumping) {
            player.velY = -player.jumpStrength * 2;
            player.jumping = true;
            jumpsound.play();
        }
    }

    if (keys[39]) {
        if (player.velX < player.speed) {
            player.velX++;
        }
    }

    if (keys[37]) {
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    if (keys[32]) {
        bullet.alive = true;
        bullet.x = player.x;
        bullet.y = player.y + 4;
        bullet.startedat = player.x;
         shootsound.play();

    }
    player.x += player.velX;
    player.y += player.velY;

    player.velX *= friction;
    player.velY += gravity;

    player.grounded = false;
    for (var i = 0; i < platforms.length; i++) {
        var direction = collisionCheck(player, platforms[i]);

        if (direction == "left" || direction == "right") {
            player.velX = 0;
        } else if (direction == "bottom") {
            player.jumping = false;
            player.grounded = true;
        } else if (direction == "top") {
            player.velY *= -1;
        }

    }

    if (player.grounded) {
        player.velY = 0;
    }




    if (enemy.grounded) {
        enemy.velY = 0;
    }

    if (collisionCheck(player, goal)) {//check if the player reach the goal
        complete();
    return;
    }

    if (!enemy.dead) {//check if the player touch the enemy
        if (collisionCheck(player, enemy)) {
            gameover();
            return;
        }
    }
   
    if (FallCheck(player)) {//check if the player fall from one  of the plateform
        gameover();
        return;
    }
     if (!completed) {
        requestAnimationFrame(loop);
    }

}


function run() {


}

function collisionCheck(character, platform) {

    var vectorX = (character.x + (character.width / 2)) - (platform.x + (platform.width / 2));
    var vectorY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2));

    var halfWidths = (character.width / 2) + (platform.width / 2);
    var halfHeights = (character.height / 2) + (platform.height / 2);

    var collisionDirection = null;

    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {

        var offsetX = halfWidths - Math.abs(vectorX);
        var offsetY = halfHeights - Math.abs(vectorY);
        if (offsetX < offsetY) {

            if (vectorX > 0) {
                collisionDirection = "left";
                character.x += offsetX;
            } else {
                collisionDirection = "right";
                character.x -= offsetX;
            }

        } else {

            if (vectorY > 0) {
                collisionDirection = "top";
                character.y += offsetY;
            } else {
                collisionDirection = "bottom";
                character.y -= offsetY;
            }

        }

    }

    return collisionDirection;

}

function FallCheck(character) {

    var collisionDirection = null;
    if (character.y > 350)
        collisionDirection = true;

    else
        collisionDirection = false;

    return collisionDirection;

}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}