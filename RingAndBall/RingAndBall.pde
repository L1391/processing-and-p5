/* Ring and Ball: A simple experimental game
* Click to form a shortly growing ring which can be used push the ball
* Avoid red obstacles
* Get the highest score
*/

Ring ring;
Ball b; 

Obstacle o[] = new Obstacle[10];

//UI buttons
Button playButton;
Button increaseDif;
Button decreaseDif;
Button backToHome;

//how many obstacles
int difficulty = 5;

//counter variables
int score = 0;
int gameCount = 0;

//is the player still alive
boolean isAlive;
//is the player on the home screen
boolean onHomeScreen;
//ensure single clicks on difficulty counter
boolean wasClicked;

void setup() {
  //reset booleans
  isAlive = false;
  onHomeScreen = true;
  wasClicked = false;
  
  //create canvas
  size(600,600);
  background(0);
  
  //create objects
  ring = new Ring();
  b = new Ball();
  for (int i=0; i<o.length; i++) {
    o[i] = new Obstacle();
  }
  playButton = new Button(width/2, height/2, 100, 40, "play");
  increaseDif = new Button(width/2 + 100, height/2 + 150, 40, 40, ">");
  decreaseDif = new Button(width/2 - 100, height/2 + 150, 40, 40, "<");
  backToHome = new Button(width/2, height/2+150, 100, 40, "home");

}

void draw() {
  //if the game is playing
  if (isAlive) {
    background(0);
  
    //show score text
    textSize(18);
    fill(255);
    text(score, 20, 20);
  
    //update the ring
    ring.update();
    //update the ball
    b.update();
  
    //some grace time at the beginning
    if (gameCount > 150) {
      
      for (int i=0; i<difficulty; i++) {
        o[i].update();
      }
      
     //increase the score every 50 frame counts
    if (gameCount % 50 == 0) score++;
    }
  
    gameCount++;
   
  //if the game was ended and is on the "death" screen
  } else if (!onHomeScreen) {
    //show the play and home buttons
    playButton.update();
    backToHome.update();
    
    if (playButton.isPressed()) {
      //reset objects
      b.spawn();
      ring.isShowing = false;
      for (int i=0; i<o.length; i++) {
        o[i].spawn();
      }
      
      //start the game
      isAlive = true;
    }
      
    if (backToHome.isPressed()) {
      //go to home screen
      onHomeScreen = true;
    }
      
    //reset count and score
    gameCount = 0;
    score = 0;
  
  //if on the home screen
  } else {
    //show play and difficulty buttons
    background(0);
    playButton.update();
    increaseDif.update();
    decreaseDif.update();
    //show other UI elements
    textSize(18);
    fill(255);
    text("Difficulty: " + difficulty, width/2 - 50, 150 + height/2);
    textSize(36);
    fill(255);
    text("Ring & Ball", width/2 - 100, 100);
    
    if (playButton.isPressed()) {
      //reset objects
      b.spawn();
      ring.isShowing = false;
      for (int i=0; i<o.length; i++) {
        o[i].spawn();
      }
      //start game
      onHomeScreen = false;
      isAlive = true;
    }
    
    //increase difficulty by one per click (press and release)
    if (increaseDif.isPressed() && difficulty < 10 && !wasClicked) {
      difficulty++;
      wasClicked = true;
    }
    //decrease difficulty by one per click (press and release)
    if (decreaseDif.isPressed() && difficulty > 2 && !wasClicked) {
      difficulty--;
      wasClicked = true;
    }
  }
}

//ensure only one action per click
void mouseReleased() {
  wasClicked = false;
}
