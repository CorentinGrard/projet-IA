const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');

//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

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
let state, player, yellow, blue, exit, message, gameScene, gameOverScene, enemies;

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
	console.log("vx : " + player.vx + "	vy : " + player.vy)
	player.x += player.vx
	player.y += player.vy
}
function end() {

}