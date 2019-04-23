const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');
const intersects = require('intersects');
//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
	loader = PIXI.loader,
    Graphics = PIXI.Graphics;

//Create a Pixi Application
let app = new Application({ 
    width: 512, 
    height: 512,                       
    antialiasing: true, 
    transparent: false, 
    resolution: 1,
    backgroundColor: 0xc9ffd1,
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//Define variables that might be used in more 
//than one function
let state, player, gameScene, enemies;

loader
	.load(setup);

function setup() {
  	//Make the game scene and add it to the stage
  	gameScene = new Container();

  	//Make the sprites and add them to the `gameScene`
	app.stage.addChild(gameScene);
	  
	//Player
	player = new Graphics();
	player.lineStyle(4, 0xFF3300, 1);
	player.beginFill(0x66CCFF);
	player.drawRect(0, 0, 32, 32);
	player.endFill();
	player.x = 170;
	player.y = 170;
	player.vx = 0;
	player.vy = 0;

	gameScene.addChild(player);

	//Make the enemies
	let numberOfEnemies = 6,
	spacing = 48,
	xOffset = 150,
	speed = 2,
	direction = 1;
	//An array to store all the enemie monsters
	enemies = [];

	for (let i = 0; i < numberOfEnemies; i++) {
		//Make a enemie
		let enemie = new Graphics();
		enemie.beginFill(0x9966FF);
		enemie.drawCircle(0, 0, 32);
		enemie.endFill();
		app.stage.addChild(enemie);
		let x = spacing * i + xOffset;

		//Give the enemie a random y position
		let y = randomInt(0, app.stage.height - enemie.height);

		//Set the enemie's position
		enemie.x = x;
		enemie.y = y;

		enemie.vy = speed * direction;

		//Reverse the direction for the next enemie
		direction *= -1;

		//Push the enemie into the `enemies` array
		enemies.push(enemie);

		//Add the enemie to the `gameScene`
		gameScene.addChild(enemie);
	}
	//Set the game state
	state = play;

	//Start the game loop 
	app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  	//Update the current game state:
	state(delta);

	Keyboard.update();
}
function play(delta) {
	const speed=5*delta;
	player.vx=0;
	player.vy=0;

	if (Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
		if(Keyboard.isKeyDown('ArrowUp', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){
			player.vx -= speed/Math.sqrt(2);
		}else{
			player.vx -= speed;
		}
	}
	if (Keyboard.isKeyDown('ArrowRight', 'KeyD') ){
		if(Keyboard.isKeyDown('ArrowUp', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){
			player.vx += speed/Math.sqrt(2);
		}else{
			player.vx += speed;
		}
	}	
	if (Keyboard.isKeyDown('ArrowUp', 'KeyZ')){
		if(Keyboard.isKeyDown('ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
			player.vy -= speed/Math.sqrt(2);
		}else{
			player.vy -= speed;
		}
	}	
	if (Keyboard.isKeyDown('ArrowDown', 'KeyS')){
		if(Keyboard.isKeyDown('ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
			player.vy += speed/Math.sqrt(2);
		}else{
			player.vy += speed;
		}
	}
	player.x += player.vx
	player.y += player.vy

	//To keep the player on the screen
	contain(player, {x: 0, y: 0, width: 512, height: 512});

	//Enemies
	enemies.forEach(function(enemie) {

		//Move the enemie
		enemie.y += enemie.vy;
	  
		//Check the enemie's screen boundaries
		let enemieHitsWall = contain(enemie, {x: 28, y: 10, width: 488, height: 480});
	  
		//If the enemie hits the top or bottom of the stage, reverse
		//its direction
		if (enemieHitsWall === "top" || enemieHitsWall === "bottom") {
		  	enemie.vy *= -1;
		}

		//Test for a collision. If any of the enemies are touching
		//the player, set `playerHit` to `true`
		if(hitCircleRectangle(enemie, player)) {
			playerHit = true;
		}
	  });


}
function end() {

}

function moving(){

}

function contain(sprite, container) {

	let collision = undefined;
  
	//Left
	if (sprite.x < container.x) {
	  sprite.x = container.x;
	  collision = "left";
	}
  
	//Top
	if (sprite.y < container.y) {
	  sprite.y = container.y;
	  collision = "top";
	}
  
	//Right
	if (sprite.x + sprite.width > container.width) {
	  sprite.x = container.width - sprite.width;
	  collision = "right";
	}
  
	//Bottom
	if (sprite.y + sprite.height > container.height) {
	  sprite.y = container.height - sprite.height;
	  collision = "bottom";
	}
  
	//Return the `collision` value
	return collision;
}

//Hit 
function hitCircleRectangle(circle, rectangle){
	return intersects.circleBox(circle.x, circle.y, circle.height, rectangle.x, rectangle.y, rectangle.width, rectangle.height)
}

//The `randomInt` helper function
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}