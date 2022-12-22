let gameHeight = 5;
let gameWidth = 10;

let tileSize = 20;

let gameBoard;

let roundNumber = 0;

let players = [];

function setup() {
  createCanvas(400,400);

  resetGame();
}


function draw() {
  background(255);
  fill(255*((roundNumber+1)%2),0,255*(roundNumber%2));
  text("player " + (roundNumber%2 + 1) + " turn", 0, height-10);

  for (let i = 0; i < gameWidth; i++) {
    for (let j = 0; j < gameHeight; j++) {
      if (gameBoard[i][j]) {
        fill(210,105,30)
        rect(i*tileSize,j*tileSize, tileSize, tileSize);
      }
    }
  }
  
  fill(255,0,0);
  circle(players[0].x,players[0].y, tileSize/2);
  fill(0,0,255);
  circle(players[1].x,players[1].y, tileSize/2);
}

function resetGame() {
  players = [];
  player1Pos = createVector((gameWidth-1)*tileSize - tileSize/2,(gameHeight-1)*tileSize- tileSize/2);
  player2Pos = createVector(1*tileSize +tileSize/2,1*tileSize + tileSize/2);
  
  players.push(player1Pos, player2Pos);

  gameBoard = [];
  for (let i = 0; i < gameWidth; i++) {
    let gameRow = [];
    for (let j = 0; j < gameHeight; j++) {
      gameRow.push(true);
    }

    gameBoard.push(gameRow);
  }
}

function keyPressed(event) {
  let player = roundNumber % 2;
  
  let leftBoundary = floor(players[player].x/tileSize) - 1;
  let upBoundary = floor(players[player].y/tileSize) - 1;
  let downBoundary = floor(players[player].y/tileSize) + 1;
  let rightBoundary = floor(players[player].x/tileSize) + 1;
  
  print(leftBoundary, upBoundary, rightBoundary, downBoundary);

  if(event.key == "ArrowLeft" && leftBoundary >= 0 && gameBoard[leftBoundary][floor(players[player].y/tileSize)]) {
    players[player].x -= tileSize;
    roundNumber++;
  } else if(event.key == "ArrowUp" && upBoundary >= 0 && gameBoard[floor(players[player].x/tileSize)][upBoundary]) {
    players[player].y -= tileSize;
    roundNumber++;
  } else if(event.key == "ArrowRight" && rightBoundary < gameWidth && gameBoard[rightBoundary][floor(players[player].y/tileSize)]) {
    players[player].x += tileSize;  
    roundNumber++;
  } else if(event.key == "ArrowDown" && downBoundary < gameHeight && gameBoard[floor(players[player].x/tileSize)][downBoundary]) {
    players[player].y += tileSize; 
    roundNumber++;
  }
}

function mouseReleased() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
  let tileX = floor(mouseX/tileSize);
  let tileY = floor(mouseY/tileSize);
    
  if (roundNumber % 2 == 0) {
    for (let i = tileX; i < gameWidth; i++) {
      for (let j = tileY; j < gameHeight; j++) {
        gameBoard[i][j] = false;
      }
    }
  } else {
    for (let i = tileX; i >= 0; i--) {
      for (let j = tileY; j >= 0; j--) {
        gameBoard[i][j] = false;
      }
    }
  }
    
  if (!gameBoard[floor(players[0].x/tileSize)][floor(players[0].y/tileSize)] && !gameBoard[floor(players[1].x/tileSize)][floor(players[1].y/tileSize)]) {
    alert("No player wins");
    resetGame();
  }
    
  if (!gameBoard[floor(players[0].x/tileSize)][floor(players[0].y/tileSize)]) {
    alert("player 2 wins");
    resetGame();
  }
  
  if (!gameBoard[floor(players[1].x/tileSize)][floor(players[1].y/tileSize)]) {
    alert("player 1 wins");
    resetGame();
  }
    
    roundNumber++;
  }
}

