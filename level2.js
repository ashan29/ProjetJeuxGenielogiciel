//creation of the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var keys = [];
var friction = 0.8;
var gravity = 0.98;
var completed = false;
var gameo=false;
//audios
var jumpsound = new Audio('jump_11.wav');
var shootsound = new Audio('shoot.wav');

var background=new Image();
background.src="background.jpg";


var player = {
    x: canvas.width -630,
    y:canvas.height -40,
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


function enemy(width, height, color, x, y,speed,movelength) {
   this.x=x;
    this.y=y;
    this.height=height;
    this.width=width;
    this.speed=speed;
    this.movelength=movelength;
    this.color=color;
   this.startat=x;
  
    var draw= function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    //move auto 
    var move= function () {
        if (this.direction == 0) {//0 left to right
            if (this.x < (this.startat + this.movelength - this.width)) {
                this.x += +1;
            } else {
                //he reach the end of the platform
                this.direction = 1;//going back
            }
        }
        else{// 1 right to left
             if (this.x > this.startat ) {
                this.x += -1;
            } else {
                this.direction = 0;
            } 
        }
    }
}

//width="640" height="360"

var goal = {
    x: 20,
    y: canvas.height - 280,
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
var platform_width = 400;
var platform_height = 10;
//adding and creating the platform
platforms.push({
    x:20,
    y: canvas.height -250,
    width: platform_width,
    height: platform_height,
    canMove:false,
});

platforms.push({
    x: canvas.width -630,
    y: canvas.height -20,
    width: platform_width,
    height: platform_height,
     canMove:false,
    
});


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

platforms.push({
    x: canvas.width -80,
    y: canvas.height -20,
    width: 100,
    height: platform_height,
    directim:0,
     canMove:true,
     move: function () {
        if (this.direction == 0) {//0 go up
            if (this.y < canvas.height -20) {
                this.y += +1;
            } else {
                //he reach the end of the platform
                this.direction = 1;//going back
            }
        }
        else{// 1 go down
             if (this.y > (canvas.height -300)) {
                this.y += -1;
            } else {
                this.direction = 0;
            } 

        }
    }

});


document.body.addEventListener("keydown", function (event) {

    if (event.keyCode == 13 && !gameStarted) {
        startlevel();
    }
     if (event.keyCode == 13 && completed) {
         //levelsound.pause();

        dynamicallyLoadScript("level3.js");
       
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
    clearCanvas();
    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Level 2", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter To Start", canvas.width / 2, canvas.height / 2 + 50);
}

function startlevel() {

    clearCanvas();
    requestAnimationFrame(loop);


}

//draw each platform in the caneva
function draw_platforms() {
     context.fillStyle = "#907020";

	for(var i = 0; i < platforms.length; i++){
		context.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
		context.lineWidth = 5;
		context.strokeStyle = "#9798A1";
		context.strokeRect(platforms[i].x, platforms[i].y-2, platforms[i].width, 5);
        if(platforms[i].canMove)
            {
                platforms[i].move();
            }
	}
}

function loop() {
//width="640" height="360"
clearCanvas();
      context.drawImage(background, 0, 0,640, 360);
    draw_platforms();
    
    goal.draw();
    player.draw();

    
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
    
      if(FallCheck(player))
         {
              window.location.reload(false); 
         return;
         }
        requestAnimationFrame(loop);
    
 if (collisionCheck(player, goal)) {//check if the player reach the goal
        complete();
    return;
    }
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
function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}