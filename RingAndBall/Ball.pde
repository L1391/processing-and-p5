class Ball {
  //position variables
  float x;
  float y;
  
  //velocity variables
  float dx;
  float dy;
  
  //ball radius
  float r = 5;
  
  //velocity loss (deceleration)
  float frictionLoss = 0.95;
  
  Ball() {
    spawn();
  }
  
  //reset ball
  void spawn() {
     x = width/2;
    y = height/2;
    dx = 0;
    dy = 0;
  }
  
  //draw circle
  void show() {
    stroke(0);
    fill(255);
    ellipse(x, y, 2*r, 2*r);
  }
  
  void update() { 
    
    //reduce velocity
    dx *= frictionLoss;
    dy *= frictionLoss;
    
    //bounce off of left and right edges
    if (x - r < 0 || x + r > width) {
      dx = -dx;
    }
    //bounce off of top and bottom edges
    if (y - r < 0 || y + r > height) {
      dy = -dy;
    }
    
    //change position by velocities
    x += dx;
    y += dy;
    
    show();
    
    //check for collision between ring and ball
    if (Math.sqrt((x-ring.x)*(x-ring.x)+(y-ring.y)*(y-ring.y)) <= ring.r + r && ring.isShowing) {
      //have velocity be in the proper direction but proportional to the ring speed
      dx = (x-ring.x) * ring.dr*ring.dr/150;
      dy = (y-ring.y)* ring.dr*ring.dr/150;
    } 
    

  }
  
}
