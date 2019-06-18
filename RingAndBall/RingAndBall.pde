/* Ring and Ball: A simple experimental game
* Click to form a shortly growing ring which can be used push the ball
* Avoid red obstacles
* Get the highest score
*/

Ring ring;
Ball b; 
//increase number of obstacles for harder difficulty
Obstacle o[] = new Obstacle[5];

//counter variables
int score = 0;
int gameCount = 0;

//is the player still alive
boolean isAlive;

void setup() {
  isAlive =true;
  size(600,600);
  background(0);

  ring = new Ring();
  b = new Ball();
  
  for (int i=0; i<o.length; i++) {
    o[i] = new Obstacle();
  }
}

void draw() {
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
      
      for (int i=0; i<o.length; i++) {
        o[i].update();
      }
      
     //increase the score every 50 frame counts
    if (gameCount % 50 == 0) score++;
    }
  
    gameCount++;
 
  } else {
    if (mousePressed) {
      //reset objects
      b.spawn();
      ring.isShowing = false;
      for (int i=0; i<o.length; i++) {
        o[i].spawn();
      }
      
      //reset count and score
      gameCount = 0;
      score = 0;
      isAlive = true;
    }
  }
}
