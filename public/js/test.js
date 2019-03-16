
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
    backgroundColor: 0x061639,
  }
);
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//Define variables that might be used in more 
//than one function
let state, player, yellow, blue, exit, message, gameScene, gameOverScene, enemies;
function setup() {
  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);
  //Make the sprites and add them to the `gameScene`
  //Player
/*  let player = new Graphics();
  player.lineStyle(4, 0xFF3300, 1);
  player.beginFill(0x66CCFF);
  player.drawRect(0, 0, 32, 32);
  player.endFill();
  player.x = 170;
  player.y = 170;
*/
  player = new Sprite(id["doge.png"]);
  player.x = 68;
  player.y = gameScene.height / 2 - player.height / 2;
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
}
function play(delta) {
}
function end() {

}