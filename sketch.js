// Defining trex variables
var trex, trexRunning, trexCollided;

// Defining ground variables
var ground, invisibleGround, groundImage;

// Defining obstacles
var obs1Image, obs2Image, obs3Image, obs4Image, obs5Image, obs6Image, obsGrp;

// Defining cloud variables
var cloudImage, cloudGrp

// Defining Score
var score;

// Defining sound
var jumpS, dieS, checkPointS;

// Defining values of game state
var PLAY = 1;
var END = 0;

// Defining game state
var gameState = PLAY;

// Defining restart and game over variables
var gameOver, restart, gameOverImage, restartImage;

// Defining some extra variables
var xVal1, yVal1, xVal2, yVal2;

// Preload function
function preload() {
  
// Loading running trex animation
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadImage("trex_collided.png");

// loading visible ground image
  groundImage = loadImage("ground2.png");
  
// Loading cloud image
  cloudImage = loadImage("cloud.png");
  
// Loading obstacle images
  obs1Image = loadImage("obstacle1.png");
  obs2Image = loadImage("obstacle2.png");
  obs3Image = loadImage("obstacle3.png");
  obs4Image = loadImage("obstacle4.png");
  obs5Image = loadImage("obstacle5.png");
  obs6Image = loadImage("obstacle6.png");
  
// Loading game over and restart images
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
// Loading sounds
  jumpS = loadSound("jump.mp3");
  dieS = loadSound("die.mp3");
  checkPointS = loadSound("checkPoint.mp3"); 
}

// Setup function
function setup() {

// Creating canvas 
  createCanvas(windowWidth, windowHeight);

// Creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.width = windowWidth + 10;
  invisibleGround.y = windowHeight / 2 - 40;
  invisibleGround.visible = false
  
//create trex sprite
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided", trexCollided)
  trex.scale = 0.5;
  
//create ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.y = windowHeight / 2 - 40;
  
// Creating game over sprite
  gameOver = createSprite(300, 80);
  gameOver.x = windowWidth / 2;
  gameOver.y = windowHeight / 2 - 100;
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
// Creating restart icon sprite
  restart = createSprite(300, 110);
  restart.x = windowWidth / 2;
  restart.y = windowHeight / 2 - 130;
  restart.addImage(restartImage);
  restart.scale = 0.4;
  restart.visible = false;
  
// Making clouds and obstacles group
  cloudGrp = new Group();
  obsGrp = new Group();  
  
// Giving initial value to score
  score = 0;
  
// Setting collider radius of trex
  trex.setCollider("circle", 0, 0, 40);

// Giving value to extra variables
  xVal1 = windowWidth / 2 - 50;
  yVal1 = windowHeight / 2 - 150;
  xVal2 = windowWidth / 2 - 40;
  yVal2 = 20;
}

// Draw function
function draw() {

// Background color
  background(160);
  
// Game state is play
  if(gameState === PLAY) {

// Moving ground
    if(ground.x < 0) {
    ground.x = ground.width / 2;
    }
    ground.velocityX = -10 - (score / 100);
      
// Jump when the space button is pressed
    if (keyDown("space") && trex.y >= invisibleGround.y - 25 || touches.length > 0 && trex.y >= 160) {
      trex.velocityY = -14;
      touches = [];
    }
    
// Coming back to ground after jumping
    trex.velocityY = trex.velocityY + 0.8
    
// Making the trex walk on the invisible ground
    trex.collide(invisibleGround);
    
// Calling cloud function
    clouds();
  
// Calling obstacles function
    obstacles();
    
// Displaying score
    fill("blue");
    text("Score: " + score, xVal1, 20);
    score += Math.round(getFrameRate() / 60);
    
// Playing checkpoint sound
    if (score % 100 === 0 && score > 0) {
 //     checkPointS.play();
    }
    
// You lose if the trex touches any obstacles
    if(obsGrp.isTouching(trex)) {
      //dieS.play();
      gameState = END;
    }
  }
  
  if(gameState === END) {
    ground.velocityX = 0;
    cloudGrp.setVelocityXEach(0);
    obsGrp.setVelocityXEach(0);
    trex.velocityY = 0;
    obsGrp.setLifetimeEach(-1);
    cloudGrp.setLifetimeEach(-1);
    trex.changeAnimation("collided", trexCollided);
    restart.visible = true;
    gameOver.visible = true;
    
    if(mousePressedOver(restart) || keyDown("R")) {
      gameState = PLAY;
      restart.visible = false;
      gameOver.visible = false;
      obsGrp.destroyEach();
      cloudGrp.destroyEach();
      score = 0;
      trex.changeAnimation("running", trexRunning);
    }
    
    fill("blue");
    text("Your Score is: " + score, xVal2, yVal2);
    text("Press 'R' to restart", xVal1, yVal1);
    if(keyDown("R")) {
      console.log("Sorry, I am yet to write it's code.. It will be available soon")
    }
  }
  
// Drawing all sprites
  drawSprites();
}

// Cloud function
function clouds() {
  if(frameCount % 100 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.x = windowWidth + 10;
    cloud.y = random(10, 60);
    cloud.addImage(cloudImage)
    cloud.scale = 0.5;
    cloud.depth = trex.depth;  
    trex.depth++;
    cloud.velocityX = -3;
    cloud.lifetime = windowWidth;
    cloudGrp.add(cloud);
  }
}  

// Obstacle function
function obstacles() {
  if(frameCount % 60 === 0) {

// Defining obstacles
    var obs = createSprite(600, 165, 10, 40);
    obs.x = windowWidth + 10;
    obs.y = windowHeight / 2 - 50;
    obs.velocityX = ground.velocityX;

    var ran = Math.round(random(1, 6))
    switch(ran) {
      case 1: obs.addImage(obs1Image);
      break;
      
      case 2: obs.addImage(obs2Image);
      break;
      
      case 3: obs.addImage(obs3Image);
      break;
      
      case 4: obs.addImage(obs4Image);
      break;
      
      case 5: obs.addImage(obs5Image);
      break;
      
      case 6: obs.addImage(obs6Image);
      break;
    }
    obs.scale = 0.5;
    obs.lifetime = windowWidth;
    obsGrp.add(obs);
  }
} 