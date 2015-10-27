// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// object prototype chain 
function baseObject() {
}

function ImageObject(imageFilePath){
  baseObject.call(this);
  this.imageItem = new Image();
  this.imageItem.src = imageFilePath;
}

function heroObject(imageFilePath,xCoordinate,yCoordinate,speed){
  ImageObject.call(this,imageFilePath);
  this.x = xCoordinate;
  this.y= yCoordinate;
  this.speed = speed;
  this.heroReady = true;
}

function monsterObject(imageFilePath,xCoordinate,yCoordinate){
  ImageObject.call(this,imageFilePath);
  this.x = xCoordinate;
  this.y= yCoordinate;
  this.monsterReady = true;
  this.speed=1;
  this.direction = true;
  this.updownDirection = true;
}

// inititalize objects and variables
var bg = new ImageObject("images/background.png");
var hero = new heroObject("images/hero.png",canvas.width / 2,canvas.height / 2,256);
var monster =  new monsterObject("images/monster.png",32 + (Math.random() * (canvas.width - 64)),32 + (Math.random() * (canvas.height - 64)));
var monstersCaught = 0;

// user input
var keysDown = {};
// add to array while key is held down
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
//remove from array once key is lifted
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.xCoordinate = canvas.width / 2;
	hero.yCoordinate = canvas.height / 2;
	
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var moveHero= function(modifier){
	// move hero 
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	
	if (hero.x > canvas.width) 
	{
		hero.x = 0;
	}
	if (hero.x < 0)
	{
		hero.x=canvas.width;
	}	
	if (hero.y > canvas.height)
	{
		hero.y=0;
	}
	if (hero.y<0)
	{
		hero.y=canvas.height;
	}
}

var moveMonster = function(){

	// randomize direction 
	var randomNumber = Math.floor((Math.random() * 1000) + 1);
	if(randomNumber > 995){
		monster.direction = !monster.direction;
	}
	var randomNumber2 = Math.floor((Math.random() * 1000) + 1);
	if(randomNumber2 > 995){
		monster.updownDirection = !monster.updownDirection;
	}
	// monster position validation 
	if (monster.x > canvas.width) 
	{
		monster.x = 0;
	}
	if (monster.x < 0)
	{
		monster.x=canvas.width;
	}	
	if(monster.y >canvas.height)
	{
		monster.y=0;
	}
	if (monster.y < 0)
	{
		monster.y=canvas.height;
	}	
	// move monster
	if(monster.direction === true){
		if(monster.updownDirection === true){
		monster.x += 1*monster.speed;
		} else {
		monster.x -= 1*monster.speed;
		}
	}
	if(monster.direction ===false){
		if(monster.updownDirection === true){
		monster.y += 1*monster.speed;
		} else {
		monster.y -= 1*monster.speed;
		}
	}
}

// Update game objects
var update = function (modifier) {

	moveHero(modifier);
	moveMonster();

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
		if(monstersCaught >3){
			monster.speed+=0.1;
			monster.imageItem.src = "images/monster2.png";
		}
	}
};

// Draw everything
var render = function () {

	ctx.drawImage(bg.imageItem, 0, 0);
	

	if (hero.heroReady) {
		ctx.drawImage(hero.imageItem, hero.x, hero.y);
	}

	if (monster.monsterReady) {
		ctx.drawImage(monster.imageItem, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

};

// The main game loop
var main = function () {
	var now = Date.now();
	
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();