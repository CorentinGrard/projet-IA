const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');
const intersects = require('intersects');
var tf = require('@tensorflow/tfjs');
var mobilenet = require('@tensorflow-models/mobilenet');



// scriptTf=document.createElement('script');
// scriptTf.src='https://unpkg.com/@tensorflow/tfjs';
// document.getElementsByTagName('head')[0].appendChild(scriptTf);

// scriptMobile=document.createElement('script');
// scriptMobile.src='https:/ensorflow-models/mobilenet';
// document.getElementsByTagName('head')[0].appendChild(scriptMobile);




/*#########################################################################
###########################################################################
#####################PARAMETRAGE DE LA PARTIE##############################
###########################################################################
#########################################################*/

/*###### Paramètres de la map par coordonnés ######*/
const tabMap = [
	[2, 0ttom"],
	[500, 0left"],             
	[300, 100, 500, 100, "top"],
	[300, 100, 300, 400, "left"],
	[300, 400, 500, 400, "bottom"],
	[500, 400, 500, 500, "left"],
	[2, 500, 500, 500, "top"],
	[2, 400, 2, 500, "right"],
	[2, 400, 200, 400, "bottom"],
	[200, 100, 200, 400, "right"],
	[2, 100, 200, 100, "top"],
	[2, 0,2, 100, "right"]                
];

const tabPolygon = [
	2, 0,             
	500, 0,             
	500, 100,
	300, 100,
	300, 400,
	500, 400,
	500, 500,
	2, 500,
	2, 400 ,
	200, 40 0,
	200, 100,
	2, 100 

]

/*###### Paramètres de la zone de départ ######*/
const startAreaValues = {

	/*###### Positionnement de l'angle supérieur gauche de la zone de départ ######*/
	x: 3,
	y: 1,

	/*#### ## Dimension de la zone de départ ######*/
	width:9 8,
	height:98

};


/*###### Paramètres de la zone d'arrivée ######*/
	t endAreaValues = {

	/*###### Positionnement de l'angle supérieur gauche de la zone de départ ######*/
	x: 401,
y: 402,

	/*###### Dimension de la zone d'arrivée ######*/
	width:98,
	height:98
	
	
	
	
	#### Paramètres de la zone d'arrivée ######*/
let Application = PIXI.Application,
    Container = PIXI.Container,
	loader = PIXI.loader,
	Graphics = PIXI.Graphics,
	Text = PIXI.Text
	Polygon = PIXI.Polygon;

 
/*###### Création de l'application PIXI ######*/
let app = new Application({ 
    width: 512, 
    height: 512,                       
    antialiasing: true, 
    transparent: true, 
    resolution: 1
});


/*###### Ajout du canvas PIXI dans le HTML ######*/
document.body.appendChild(app.view);

/*###### Définition de toutes les variables ######*/
let state, player, gameScene,winScene, enemies, startArea, endArea, winMessage;

/*###### Chargement de la coufiguration ci-dessous ######*/
loader
	.load(setup);




/*#########################################################################
###########################################################################
#####################PARAMETRAGE DE LA PARTIE##############################
###########################################################################
#########################################################################*/

unction setup() {


	/*###### Création de la scene de jeu ######*/
	gameScene = new Container();


	/*###### Création de la scene de victoire, cachée en début de partie ######*/
	winScene = new Container();
	winScene.visible = false;


	/*###### Ajout des scenes à l'application ######*/
	app.stage.addChild(gameScene);
	app.stage.addChild(winScene);
	 
    
	/*###### Création du plateau de jeu et ajout à la scene de jeu ######*/

	/*###### Différenciation de la forme en coordonnées et du dessin de la map ######*/
	gameBoardDraw = new Graphics();

	gameBoardDraw.beginFi ll (0xC0C0C0); 
	gameBoardDraw.drawPolygon(tabPolygon);
	gameBoardDraw.endFill();
	gameBoardDraw.x = 0;
	gameBoardDraw.y = 0;
gameScene.addChild(gameBoardDraw);

	tabWall = [];
	tabMap.forEach(function(wall) {
		wallCreation(wall[0],wall[1],wall[2],wall[3],wall[4]);
	});   

	/*###### Création de la zone de départ et ajout à la scene de jeu ######*/
	startArea = new Graphics();
	startArea.beginFill(0xc9ffd1);
	startArea.drawRect(0,0,startAreaValues.width,startAreaValues.height);
startArea.endFill();
	startArea.x = startAreaValues.x;
	startArea.y = startAreaValues.y;
	gameScene.addChild(startArea);
	
	 
	/*###### Création de la zone d'arrivée et ajout à la scene de jeu ######*/
	endArea = new Graphics();
	endArea.beginFill(0xFF0000);
	endArea.drawRect(0,0,endAreaValues.width,endAreaValues.height);
	endArea.endFill();
	endArea.x = endAreaValues.x;
	endArea.y = endAreaValues.y;
gameScene.addChild(endArea);

	
	/*###### Création du joueur et ajout à   la  scene de jeu # # ####*/
	player = new Graphics();
	player.lineStyle(0, 0xFF3300, 1);
player.beginFill(0x66CCFF);
	player.drawRect(0, 0, 32, 32);
	player.endFill();
	player.x = findXCen ter Of Sp awnni ngArea();
	player.y = findYCen ter OfS pa wnnin gArea();
	player.vx = 0;     
	player.vy = 0;     
	gameScene.addChild (pla ye r) ; 
     
	
	/*###### Création du message de victoire et ajout à la scene de victoire ######*/
	winMessage = new Text("Victoire !");
	winMessage.position.set(app.view.width/2,app.view.height/2);
	winScene.addChild(winMessage);

	
	/*###### Création des ennemies ######*/
	enemies = [];
	enemieCreation(125,25,1,2,true,350);
	enemieCreation(480,75,-1,2,true,350);
	enemieCreation(225,125,1,2,false,250);
	enemieCreation(275,375,-1,2,false,250);
	enemieCreation(25,425,1,2,true,350);
	enemieCreation(375,475,-1,2,true,350);

	/*###### Mise à jour du statut de la partie ######*/
	state = play;

	/*###### Démmarage de la boucle de jeu ######*/ 
	app.ticker.add(delta => gameLoop(delta));
}
 
	




/*#########################################################################
###########################################################################
#######################LANCEMENT DE LA PARTIE##############################
###########################################################################
############ # # # ##########################################################*/
  
  
/*###### Fonction permettant de générer la fréquance de rafréchissement de la partie ######*/
/*###### Ici : 60Hz nativement ######*/
function gameLoop(delta){ 
  	/ /Update the current game state: 
	state(delta);  

	Keybo ard.update();
}

/*###### Fonction appellée à chaque tic d'horloge ######*/
function play(delta) { 
	//c onsole.log("x : "+player.x + "		y : "+player.y) 
	const speed=5*delta ; 
	pl ayer .vx=0;
	player.vy=0;

	/###### Gestion du mouvement du personnage dans le plateau de jeu ######*/
	if (Keyboard.isKeyDown('ArrowLeft', 'KeyQ' )){
		if (Keyboard.isKeyDown('ArrowUp', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){ 
			player.x -= speed / Math.sqrt(2);
		}  
		else{
			move("Left",speed);
		
	} 
	if  (Keyboard.isKeyDown('ArrowRight', 'KeyD') ){ 
		if(Keyboard.isKeyDown('ArrowU p ', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){
			 play er.x += speed/Math.sqrt(2);
		}else{
			move("Right",speed);
		}
	}	
	if (Keyboard.isKeyDown(' ArrowUp', 'KeyZ')){
		if(Keyboard.isKeyDown( 'ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
			player.y -= speed/Math.sqrt(2);
		}else{
			move("Up",speed);
		}
	}	 
	if (Keyboard.isKeyDown('ArrowDown', 'KeyS')){
if(Keyboard.isKeyDown('ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
			player.y += Math.round(speed/Math.sqrt(2));
}else{
			move("Down",speed);
		}


	tabWall.forEach(function(courantWall) {
		collision(courantWall,player);
	});


	/*###### Boucle sur tous les ennemis pour gérer leurs mouvements et leurs collisions ######*/
nemies.forEach(function(enemie) {

		 
		/*###### Déplacement des ennemis à chaque tic d'horloge ######*/
		
		enemie.distance -= Math.abs(enemie.vx);
		enemie.distance -= Math.abs(enemie.vy);
		
	if (enemie.distance <= 0) {
			enemie.vx *= -1;
			 enemie.vy *= -1;         
			enemie.distance = enemie.distanceStorage;
		}
		enemie.x += enemie.vx;
		enemie.y += enemie.vy;
		
		/*###### Vérification de collision entre l'ennemie courant et le joueur ######*/
		if(hitCircleRectangle(enemie, player)) {
			/*###### Retour en zone de départ si collis ion ######*/
			player.x = findXCenterOfSpawnningArea();          
			player.y = findYCenterOfSpawnningArea();
		}
	});
	
	/*###### Vérification de collision entre le joueur et la zone d'arrivée ######*/
	if(intersects.boxBox(player.x,player.y,player.width,player.height,endArea.x+10,endArea.y,endArea.width,endArea.height)) {
		gameScene.visible = false;
		winScene.visible = true;
	}
}

// Fonctions de déplacement du joueur (purement vertical ou horizontal)
function move(direction,speed) {
	switch (direction) {
		case 'Left':
			player.x -= speed;
			break;
		case 'Right':
			player.x += speed;
			break;     
		case 'Up':
			player.y -= speed;
			break;
		case 'Down':
		player.y += speed;
			break;		 
	}
}



/*###### Fonction retournant vrai si le cercle et le rectangle en paramètre sont en collision ######*/
/* #### ## L'ajustement des hauteurs/largeurs permet d'ajuster les hitboxs "mal gérées" entre cercle et rectangle ######*/
function hitCirceRectangle(circle, rectangle){
	return intersects.circleBox(circle.x, circle.y, circle.height-6, rectangle.x+3, rectangle.y+3, rectangle.width-6, rectangle.height-6);
}

/*###### Fonction permettant de générer un entier aléatoire présent entre deux entiers ######*/
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

    
/*###### Fonction permettant de trouver l'abscisse du centre de la zone de départ ######*/
function findXCenterOfSpawnningArea() {
	return Math.round (((startArea.x + (startArea.x + startArea.width)) / 2) - (player.width / 2));
}

/*###### Fonction permettant de trouver l'ordonnée du centre de la zone de départ ######*/
function findYCenterOfSpawnningArea() {
	return Math.ro und(((startArea.y + (startArea.y + startArea.height)) / 2) - (player.height / 2));
} 

/*###### Fonction permettant la création et l'ajout dans la partie d'un ennemi ######*/
function enemieCreation(x,y,direction,speed,horizontalMovement,distance) {
	let enemie = new Graphics();
	enemie.beginFill(0x9966FF);
	enemie.drawCircle(0, 0, 6);
	enemie.endFill();
	
	enemie.x = x;
	enemie.y = y;
	enemie.horizontalMovement = horizontalMovement;

	if (enemie.horizontalMovement) {
		enemie.vx = speed * direction;
		enemie.vy = 0;
	}else{
		enemie.vx = 0;	 
		enemie.vy = speed * direction;
	}
	en emie.distance = distance;
	enemie.distanceStorage = distance;           
	gameScene.addChild(enemie);
	enemies.push(enemie);
}           

function wallCreation(firstPointX,firstPointY,lastPointX,lastPointY,gameSide) {

	let wall = new Graphics();
all.lineStyle(1,0x000000, 1);
	wall.x = firstPointX;
	wall.y = firstPointY;
	wall.sx = lastPointX; 
	wall.sy = lastPointY;
	wall.moveTo(0,0);
	wall.lineTo((lastPointX - firstPointX),(lastPointY - firstPointY));
	
	if (wall.x == wall.sx) {
		wall .verticality = true;
	}
	else {
		wall.verticality = false;
	}

	wall.gameSide = gameSide;
	tabWall.push(wall);
	gameScene.addChild(wall);


}

    
fur) {

let inter; 
	if(courantWall.verticality == true) {
		inter = intersects.lineBox(courantWall.x,courantWall.y+7,courantWall.sx,courantWall.sy-7,player.x,player.y,player.width,player.height);
	}
	else if (courantWall.verticality == false) {
		inter = intersects.lineBox(courantWall.x+7,courantWall.y,courantWall.sx-7,courantWall.sy,player.x,player.y,player.width,player.height);
	}


	if (inter) {
		
		if (courantWall.verticality == true) {
			if (courantWall.gameSide == "left") {
				player.x = courantWall.x - player.width -1;
			}
			else if (courantWall.gameSide == "right") {
				player.x = courantWall.x;
			}
		}
		else{
			if (courantWall.gameSide == "top") {
				player.y = courantWall.y - player.height;
			}
			else if (courantWall.gameSide == "bottom") {
				player.y = courantWall.y + 1;
			}
		}
	}


}






// Partie IA

var section = document.createElement("section");
section.innerHTML = `
<video autoplay playsinline muted id="webcam" width="224" height="224"></video>
<button id="left">Left</button>
<button id="right">Right</button>
<button id="up">Up</button>
<button id="down">Down</button>
<br>
<button onclick="train()" id=\"train\">train</button>
<button onclick="show()" id=\"train\">show</button>
`;

document.body.appendChild(section);

const webcamElement = document.getElementById('webcam');

// Select buttons
const left = document.getElementById("left");
const right = document.getElementById("right");
const up = document.getElementById("up");
const down = document.getElementById("down")

var show_class = false;

var features = [];

var targets = [];

left.addEventListener("mousedown", () => { left.clicked = true; });
right.addEventListener("mousedown", () => { right.clicked = true; });
down.addEventListener("mousedown", () => { down.clicked = true; });
up.addEventListener("mousedown", () => { up.clicked = true; });
left.addEventListener("mouseup", () => { left.clicked = false; });
right.addEventListener("mouseup", () => { right.clicked = false; });
down.addEventListener("mouseup", () => { down.clicked = false; });
up.addEventListener("mouseup", () => { up.clicked = false; });

// Input
const input = tf.input({batchShape: [null, 1000]});
// Output
const output = tf.layers.dense({useBias: true, units: 4, activation: 'softmax'}).apply(input);
// Create the model
const model = tf.model({inputs: input, outputs: output});
// Optimize
const optimizer = tf.train.adam(0.01);
// Compile the model
model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

async function setupWebcam() {
	return new Promise((resolve, reject) => {
	  const navigatorAny = navigator;
	  navigator.getUserMedia = navigator.getUserMedia ||
		  navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
		  navigatorAny.msGetUserMedia;
	  if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true},
		  stream => {
			webcamElement.srcObject = stream;
			webcamElement.addEventListener('loadeddata',  () => resolve(), false);
		  },
		  error => reject());
	  } 
	  else {
		reject();
	  }
	});
}


function show(){
	show_class = true;
}


function train(){
	// Train the model
	console.log("Train");
	const tf_features = tf.tensor2d(features, shape=[features.length, 1000])
	const tf_targets = tf.tensor(targets);
	model.fit(tf_features, tf_targets, {
	batchSize: 32,
	epochs: 75,
	callbacks: {
		onBatchEnd: async (batch, logs) => {
		// Log the cost for every batch that is fed.
		console.log(logs.loss.toFixed(5));
		await tf.nextFrame();
		}
	}
	});
}


function add_features(feature){
	// Add features to one class if one button is pressed
	if (left.clicked){
		console.log("gather left");
		features.push(feature);
		targets.push([1., 0., 0., 0.]);
	}
	else if (right.clicked){
		console.log("gather right");
		features.push(feature);
		targets.push([0., 1., 0., 0.]);
	}
	else if (up.clicked){
		console.log("gather up");
		features.push(feature);
		targets.push([0., 0., 1., 0.]);
	}
	else if (down.clicked){
		console.log("gather down");
		features.push(feature);
		targets.push([0., 0., 0., 1.]);
	}
}


async function appli() {
	console.log('Loading mobilenet..');
	// Load the model.
	net = await mobilenet.load();
	// Model loaded
	console.log('Sucessfully loaded model');
	await setupWebcam();
	// Wait for the webcam to be setup
	while(true) {
		//const result = await net.classify(webcamElement);
		const feature = await net.infer(webcamElement);
		//console.log(feature);
		//console.log(feature.buffer().values);
		add_features(Array.from(feature.buffer().values));
		//console.log("Prediction", result[0].className);
		//console.log("Probability", result[0].probability);
		if (show_class){
			const prediction = model.predict(feature);
			const labels = ["Left", "Right", "Up", "Down"];
			cl = prediction.argMax(1).buffer().values[0];
			console.log(cl, labels[cl]);
			move(labels[c1]);
		}
		// Wait for the next frame
		await tf.nextFrame();
	}
	
}

appli();