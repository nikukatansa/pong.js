var MAX_ROUNDS = 11;
var gameState;
var padOffset = 50;
var padLeft, padRight;
var leftColor, rightColor;
var padHeight = 40;
var padWidth = 5;
var padStep = 10;
var ballX, ballY;
var theta; // Y axis (down) is 0, angle measured counterclockwise
var ballVel;
var power;
var ballR = 9;
var scoreLeft, scoreRight;
var centreR = 2;
var dashLength = 20;
var paddleColors = ['white', 'yellow', 'orange', 'red', 'magenta', 'orchid', 'royalblue', 'aqua', 'lime'];

function setup() {
  createCanvas(800,600);
  rectMode(RADIUS);
  angleMode(DEGREES);
  textAlign(CENTER);
  scoreLeft = 0;
  scoreRight = 0;
  leftColor = 0;
  rightColor = 0;
  gameState = -2;  // Menu
  padLeft = height/2;
  padRight = height/2;
  velScaleFactor = 1.15;
  ballVel = createVector(0,0);
  ballX = width/2;
  ballY = random(2*ballR, height - (2*ballR));
}

function draw() {
  background(51);
  fill(255);
  noStroke();
  
  
  if (abs(gameState) < 2){
    // Centre line
    for (var i=0; i < (height/(2*dashLength)); i++){
      rect(width/2, i * (2*dashLength), centreR, dashLength/2);
    }
    
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
    if (abs(gameState) == 1){
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
    rect(ballX, ballY, ballR, ballR);
    textSize(40);
    text(scoreLeft, width/4, 40);
    text(scoreRight, 3*width/4, 40);
    
  } else if (gameState == -2) {
    // Main menu
    textSize(100);
    text("PONG", width/2, height/2);
    textSize(16);
    text("PRESS SPACE TO START\nW / S controls left paddle\nUp / Down controls right paddle", width/2, height*3/4);
    if (keyIsDown(32)) { // Space starts the game
      gameState = random([-1,1]);  // Choose random start direction (-1 to left, 1 to right)
      
      
    }
  }
  
  fill(paddleColors[leftColor]);
  rect(padOffset + padWidth, padLeft, padWidth, padHeight);
  fill(paddleColors[rightColor]);
  rect(width-padOffset-padWidth, padRight, padWidth, padHeight);
  
}

function keyPressed(){
  if (keyCode == 49){
    leftColor = (leftColor + 1) % paddleColors.length;
  }
  if (keyCode == 50){
    rightColor = (rightColor + 1) % paddleColors.length;
  }
}