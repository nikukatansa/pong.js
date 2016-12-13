var gameState;
var padOffset = 50;
var padLeft, padRight;
var padHeight = 40;
var padWidth = 5;
var padStep = 5;
var ballX, ballY;
var theta; // Y axis (down) is 0, angle measured counterclockwise
var ballVel;
var power;
var ballR = 9;
var scoreLeft, scoreRight;

function setup() {
  createCanvas(640,480);
  rectMode(RADIUS);
  angleMode(DEGREES);
  textAlign(CENTER);
  scoreLeft = 0;
  scoreRight = 0;
  gameState = -1;  // Left paddle
  padLeft = height/2;
  padRight = height/2;
  velScaleFactor = 1.15;
  ballVel = createVector(0,0);
  ballX = padOffset + (2 * padWidth) + ballR;
  ballY = height/2;
}

function draw() {
  background(51);
  fill(200);
  noStroke();
  
  // Movement of paddles
  if (keyIsDown(87) && (padLeft - padHeight - padStep) >= 0 ){ // W pressed
    padLeft -= padStep;
    if (gameState == -1){
      ballY -= padStep;
    }
  }
  if (keyIsDown(83) && (padLeft + padHeight + padStep) <= height ) { // S pressed
    padLeft += padStep;
    if (gameState == -1){
      ballY += padStep;
    }
  }
  if (keyIsDown(38) && (padRight - padHeight - padStep) >= 0) { // UP pressed
    padRight -= padStep;
    if (gameState == 1){
      ballY -= padStep;
    }
  }
  if (keyIsDown(40) && (padRight + padHeight + padStep) <= height ) { // DOWN pressed
    padRight += padStep;
    if (gameState == 1){
      ballY += padStep;
    }
  }
  if (keyIsDown(32)){ // SPACE pressed
    if (gameState == -1){ // Start round at left paddle
      theta = 90;
      power = 1;
      ballVel = createVector(power * sin(theta), power * cos(theta));
      gameState = 0;
    }
    if (gameState == 1){ // Start round at right paddle
      theta = 270;
      power = 1;
      ballVel = createVector(power * sin(theta), power * cos(theta));
      gameState = 0;
    }
  }
  
  // Movement of ball
  if (gameState == 0){
    if (ballY - ballR <= 0){ // TOP EDGE
      ballVel = createVector(ballVel.x, -ballVel.y);
    }
    
    if (ballY + ballR >= height) { // BOTTOM EDGE
      ballVel = createVector(ballVel.x, -ballVel.y);
    }
    
    if ((ballX + ballR > width-padOffset-(2*padWidth)) && 
        (abs(ballY-padRight) <= padHeight)) { // RIGHT PADDLE
      power *= velScaleFactor;
      theta = map(ballY-padRight, -padHeight, padHeight, 210, 330);
      console.log("R " + (ballY-padRight) + "=>" + theta);
      ballVel = createVector(power * sin(theta), power * cos(theta));
    }
    
    if ((ballX - ballR < padOffset+(2*padWidth)) &&
        (abs(ballY-padLeft) <= padHeight)) { // LEFT PADDLE
      power *= velScaleFactor;
      theta = map(padLeft-ballY, -padHeight, padHeight, 30, 150);
      console.log("L " + (ballY-padLeft) + "=>" + theta);
      ballVel = createVector(power * sin(theta), power * cos(theta));
    }
  }
  
  // End of round conditions
  if (ballX-ballR <= 0) { 
    scoreRight += 1;
    ballX = padOffset + (2 * padWidth) + ballR;
    ballY = padLeft;
    ballVel = createVector(0,0);
    gameState = -1;
  }
  
  if (ballX+ballR >= width) {
    scoreLeft += 1;
    ballX = width - padOffset - (2 * padWidth) - ballR;
    ballY = padRight;
    ballVel = createVector(0,0);
    gameState = 1;
  }
  
  ballX += ballVel.x;
  ballY += ballVel.y;
  
  textSize(40);
  text(scoreLeft + " - " + scoreRight, width/2, 40);
  rect(padOffset + padWidth, padLeft, padWidth, padHeight);
  rect(width-padOffset-padWidth, padRight, padWidth, padHeight);
  rect(ballX, ballY, ballR, ballR);
  
}