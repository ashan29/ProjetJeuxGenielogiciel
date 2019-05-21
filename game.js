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
var gameo=false;

//audios
var jumpsound = new Audio('jump_11.wav');
var shootsound = new Audio('shoot.wav');
var levelsound= new Audio('level1sound.mp3');

var imggoal = new Image();
imggoal.src="castledoors.png";

var background=new Image();
background.src="level1back.png";



//to start the game
document.body.addEventListener("keydown", function (event) {

    if (event.keyCode == 13) {
         startGame();
         
       
       
    }
 
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
    dynamicallyLoadScript("level1.js");
    document.body.removeEventListener("keydown");
    levelsound.play();
  
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


function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}