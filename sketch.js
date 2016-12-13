var MAX_ROUNDS = 11;
var gameState;
var padOffset = 50;
var padLeft, padRight;
var padHeight = 40;
var padWidth = 5;
var padStep = 10;
var ballX, ballY;
var theta; // Y axis (down) is 0, angle measured counterclockwise
var ballVel;
var power;
var ballR = 9;
var scoreLeft, scoreRight;

function setup() {
  createCanvas(800,600);
  rectMode(RADIUS);
  angleMode(DEGREES);
  textAlign(CENTER);
  scoreLeft = 0;
  scoreRight = 0;
  gameState = random([-1,1]);  // Choose random start direction (-1 to left, 1 to right)
  padLeft = height/2;
  padRight = height/2;
  velScaleFactor = 1.15;
  ballVel = createVector(0,0);
  ballX = width/2;
  ballY = random(2*ballR, height - (2*ballR));
}

function draw() {
  background(51);
  fill(200);
  noStroke();
  
  // Movement of paddles
  if (keyIsDown(87) && (padLeft - padHeight - padStep) >= 0 ){ // W pressed
    padLeft -= padStep;
  }
  if (keyIsDown(83) && (padLeft + padHeight + padStep) <= height ) { // S pressed
    padLeft += padStep;
  }
  if (keyIsDown(38) && (padRight - padHeight - padStep) >= 0) { // UP pressed
    padRight -= padStep;
  }
  if (keyIsDown(40) && (padRight + padHeight + padStep) <= height ) { // DOWN pressed
    padRight += padStep;
  }
  
  // Round reset
  if (gameState != 0){
    theta = random(120-(90*gameState), 240-(90*gameState)); // [30,150] if gS=1, [210,330] if gS=-1
    power = 3;
    ballVel = createVector(power * sin(theta), power * cos(theta));
    gameState = 0;
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
        (abs(ballY-padRight) <= padHeight)) { // RIGHT PADDLE bounce
      power *= velScaleFactor;
      theta = map(ballY-padRight, -padHeight, padHeight, 210, 330);
      ballVel = createVector(power * sin(theta), power * cos(theta));
    }
    
    if ((ballX - ballR < padOffset+(2*padWidth)) &&
        (abs(ballY-padLeft) <= padHeight)) { // LEFT PADDLE bounce
      power *= velScaleFactor;
      theta = map(padLeft-ballY, -padHeight, padHeight, 30, 150);
      ballVel = createVector(power * sin(theta), power * cos(theta));
    }
  }
  
  // End of round conditions
  if (ballX-ballR <= 0) { 
    scoreRight += 1;
    ballX = width/2;
    ballY = random(2*ballR, height - (2*ballR));
    ballVel = createVector(0,0);
    gameState = -1;
    if (scoreRight == MAX_ROUNDS){
      noLoop(); // End of game, right has won
    }
  }
  
  if (ballX+ballR >= width) {
    scoreLeft += 1;
    ballX = width/2;
    ballY = random(2*ballR, height - (2*ballR));
    ballVel = createVector(0,0);
    gameState = 1;
    if (scoreLeft == MAX_ROUNDS){
      noLoop(); // End of game, left has won
    }
  }
  
  ballX += ballVel.x;
  ballY += ballVel.y;
  
  textSize(40);
  text(scoreLeft + " - " + scoreRight, width/2, 40);
  rect(padOffset + padWidth, padLeft, padWidth, padHeight);
  rect(width-padOffset-padWidth, padRight, padWidth, padHeight);
  rect(ballX, ballY, ballR, ballR);
  
}