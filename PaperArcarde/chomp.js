let chompGame = new p5((s) => {
  let gameWidth = 5;
  let gameHeight = 10;

  let tileSize = 20;

  let gameBoard;
  
  s.setup = () => {
    document.getElementById("gameWidth").value = gameWidth;
    document.getElementById("gameHeight").value = gameHeight;
    
  s.createCanvas(400,400);
  
  s.resetGame();
  };


  s.draw = () => {
    s.background(255);

    for (let i = 0; i < gameHeight; i++) {
      for (let j = 0; j < gameWidth; j++) {
        if (gameBoard[i][j]) {
          s.fill(210,105,30)
          s.rect(i*tileSize,j*tileSize, tileSize, tileSize);
        }
      }
    }
  }

  s.resetGame = () => {
    gameWidth = document.getElementById("gameWidth").value;
    gameHeight = document.getElementById("gameHeight").value;
    
    gameBoard = [];
    for (let i = 0; i < gameHeight; i++) {
      let gameRow = [];
      for (let j = 0; j < gameWidth; j++) {
        gameRow.push(true);
      }

      gameBoard.push(gameRow);
    }
  }

  s.mouseReleased = () => {
    if (s.mouseX > 0 && s.mouseY > 0) {
       let tileX = s.floor(s.mouseX/tileSize);
    let tileY = s.floor(s.mouseY/tileSize);

    for (let i = tileX; i < gameHeight; i++) {
      for (let j = tileY; j < gameWidth; j++) {
          gameBoard[i][j] = false;
      }
    }
    }
  }
  
}, document.getElementById('chomp'));
