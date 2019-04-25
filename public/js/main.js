const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');
const intersects = require('intersects');

/*#########################################################################
###########################################################################
#####################PARAMETRAGE DE LA PARTIE##############################
###########################################################################
#########################################################################*/

/*###### Paramètres de la map par coordonnés ######*/
const tabMap = [
	0, 0,             
	500, 0,             
	500, 100,
	300, 100,
	300, 400,
	500, 400,
	500, 500,
	0, 500,
	0, 400,
	200, 400,
	200, 100,
	0, 100                
];

/*###### Paramètres de la zone de départ ######*/
const startAreaValues = {

	/*###### Positionnement de l'angle supérieur gauche de la zone de départ ######*/
	x: 4,
	y: 2,

	/*###### Dimension de la zone de départ ######*/
	width:96,
	height:96,

};


/*###### Paramètres de la zone d'arrivée ######*/
const endAreaValues = {

	/*###### Positionnement de l'angle supérieur gauche de la zone de départ ######*/
	x: 405,
	y: 402,

	/*###### Dimension de la zone d'arrivée ######*/
	width:96,
	height:96,

};


/*###### Paramètres de la zone d'arrivée ######*/
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

function setup() {


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
	gameBoardPhysic = new Polygon(tabMap);

	gameBoardDraw.beginFill(0x87CEFA);
	gameBoardDraw.lineStyle(4, 0x000000, 1);
	gameBoardDraw.drawPolygon(gameBoardPhysic);
	gameBoardDraw.endFill();
	gameBoardDraw.x = 2;
	gameBoardDraw.y = 0;
	gameScene.addChild(gameBoardDraw);


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

	
	/*###### Création du joueur et ajout à la scene de jeu ######*/
	player = new Graphics();
	player.lineStyle(4, 0xFF3300, 1);
	player.beginFill(0x66CCFF);
	player.drawRect(0, 0, 32, 32);
	player.endFill();
	player.x = findXCenterOfSpawnningArea();
	player.y = findYCenterOfSpawnningArea();
	player.vx = 0;
	player.vy = 0;
	gameScene.addChild(player);

	
	/*###### Création du message de victoire et ajout à la scene de victoire ######*/
	winMessage = new Text("Victoire !");
	winMessage.position.set(app.view.width/2,app.view.height/2);
	winScene.addChild(winMessage);

	
	/*###### Création des ennemies ######*/
	enemies = [];
	enemieCreation(125,25,1,2,true);
	enemieCreation(480,75,-1,2,true);
	enemieCreation(225,125,1,2,false);
	enemieCreation(275,375,-1,2,false);
	enemieCreation(25,425,1,2,true);
	enemieCreation(375,475,-1,2,true);

	/*###### Mise à jour du statut de la partie ######*/
	state = play;

	/*###### Démmarage de la boucle de jeu ######*/ 
	app.ticker.add(delta => gameLoop(delta));
}






/*#########################################################################
###########################################################################
#######################LANCEMENT DE LA PARTIE##############################
###########################################################################
#########################################################################*/


/*###### Fonction permettant de générer la fréquance de rafréchissement de la partie ######*/
/*###### Ici : 60Hz nativement ######*/
function gameLoop(delta){
  	//Update the current game state:
	state(delta);

	Keyboard.update();
}

/*###### Fonction appellée à chaque tic d'horloge ######*/
function play(delta) {
	const speed=5*delta;
	player.vx=0;
	player.vy=0;

	/*###### Gestion du mouvement du personnage dans le plateau de jeu ######*/
	if (Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
		if(gameBoardPhysic.contains(player.x-5,player.y)) {
			if(Keyboard.isKeyDown('ArrowUp', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){
				player.x -= speed/Math.sqrt(2);
			}else{
				player.x -= speed;
			}
		}
	}
	if (Keyboard.isKeyDown('ArrowRight', 'KeyD') ){
		if (gameBoardPhysic.contains((player.x + player.width),player.y)) {
			if(Keyboard.isKeyDown('ArrowUp', 'KeyZ') || Keyboard.isKeyDown('ArrowDown', 'KeyS')){
				player.x += speed/Math.sqrt(2);
			}else{
				player.x += speed;
			}
		}
	}	
	if (Keyboard.isKeyDown('ArrowUp', 'KeyZ')){
		if (gameBoardPhysic.contains(player.x,player.y-5)) {
			if(Keyboard.isKeyDown('ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
				player.y -= speed/Math.sqrt(2);
			}else{
				player.y -= speed;
			}
		}
	}	
	if (Keyboard.isKeyDown('ArrowDown', 'KeyS')){
		if (gameBoardPhysic.contains(player.x,(player.y+player.height))) {
			if(Keyboard.isKeyDown('ArrowRight', 'KeyD') || Keyboard.isKeyDown('ArrowLeft', 'KeyQ')){
				player.y += speed/Math.sqrt(2);
			}else{
				player.y += speed;
			}
		}
	}

	/*###### Boucle sur tous les ennemis pour gérer leurs mouvements et leurs collisions ######*/
	enemies.forEach(function(enemie) {

		/*###### Déplacement des ennemis à chaque tic d'horloge ######*/
		enemie.x += enemie.vx;
		enemie.y += enemie.vy;
		
	  
		/*###### Conditions de changement de sens de déplacement des ennemis ######*/

		/*###### Verification de présence dans le plateau de jeu avec une marge de 10px pour le haut ######*/
		if (!gameBoardPhysic.contains(enemie.x + 10,enemie.y + 10) ) {
			enemie.vx *= -1;
			enemie.vy *= -1;
		}
		/*###### Verification de présence dans le plateau de jeu avec une marge de 10px pour le bas ######*/
		if (!gameBoardPhysic.contains(enemie.x - 10,enemie.y - 10)) {
			enemie.vx *= -1;
			enemie.vy *= -1;
		}

		/*###### Exclusion des ennemis de la zone de départ ######*/
		if (hitCircleRectangle(enemie, startArea)) {
			enemie.vx *= -1;
			enemie.vy *= -1;	
		}	

		/*###### Exclusion des ennemis de la zone d'arrivée ######*/
		if (hitCircleRectangle(enemie, endArea)) {
			enemie.vx *= -1;
			enemie.vy *= -1;
		}

		/*###### Vérification de collision entre l'ennemie courant et le joueur ######*/
		if(hitCircleRectangle(enemie, player)) {
			/*###### Retour en zone de départ si collision ######*/
			player.x = findXCenterOfSpawnningArea();
			player.y = findYCenterOfSpawnningArea();
		}
	});
	
	/*###### Vérification de collision entre le joueur et la zone d'arrivée ######*/
	if(hitCircleRectangle(endArea, player)) {
		gameScene.visible = false;
		winScene.visible = true;
	}
}

/*###### Fonction retournant vrai si le cercle et le rectangle en paramètre sont en collision ######*/
/*###### L'ajustement des hauteurs/largeurs permet d'ajuster les hitboxs "mal gérées" entre cercle et rectangle ######*/
function hitCircleRectangle(circle, rectangle){
	return intersects.circleBox(circle.x, circle.y, circle.height-6, rectangle.x+3, rectangle.y+3, rectangle.width-6, rectangle.height-6);
}

/*###### Fonction permettant de générer un entier aléatoire présent entre deux entiers ######*/
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*###### Fonction permettant de trouver l'abscisse du centre de la zone de départ ######*/
function findXCenterOfSpawnningArea() {
	return Math.round(((startArea.x + (startArea.x + startArea.width)) / 2) - (player.width / 2));
}

/*###### Fonction permettant de trouver l'ordonnée du centre de la zone de départ ######*/
function findYCenterOfSpawnningArea() {
	return Math.round(((startArea.y + (startArea.y + startArea.height)) / 2) - (player.height / 2));
}

/*###### Fonction permettant la création et l'ajout dans la partie d'un ennemi ######*/
function enemieCreation(x,y,direction,speed,hozizontalMovement) {
	let enemie = new Graphics();
	enemie.beginFill(0x9966FF);
	enemie.drawCircle(0, 0, 6);
	enemie.endFill();
	
	enemie.x = x;
	enemie.y = y;

	if (hozizontalMovement) {
		enemie.vx = speed * direction;
		enemie.vy = 0;	
	}else{
		enemie.vx = 0;	
		enemie.vy = speed * direction;
	}
	gameScene.addChild(enemie);
	enemies.push(enemie);
}