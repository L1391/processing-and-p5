class Obstacle {
  //position variables
  float x;
  float y;
  
  //radius
  float r = 10;
  
  //velocity variables
  float dx;
  float dy;
      
  Obstacle() {
    spawn();
  }
  
  
  void spawn() {
    //fair randomizer for vertical or horizontal obstacle
    float dir = Math.round(random(-0.5,3.5));

    if ( dir == 0) {
      x = 0;
      y = random(0, height);
      dx = random(1, 15);
      dy = 0;
    } else if ( dir == 1){
      y = 0;
      x = random(0, width);
      dx = 0;
      dy = random(1, 15);
    }  else if ( dir == 2) {
      x = width;
      y = random(0, height);
      dx = -random(1, 15);
      dy = 0;
    } else {
      y = height;
      x = random(0, width);
      dx = 0;
      dy = -random(1, 15);
    }
  }
  
  //draw circle
  void show() {
    stroke(0);
    fill(255,0,0);
    ellipse(x,y,2*r,2*r);
  }
  
  void update() {    
    //change position
    x += dx;
    y += dy;
    
    show();
    
    //respawn if hits an edge
    if (x > width || y > height || x < 0 || y < 0) spawn();
  
    //end game if contacts ball
    if (Math.sqrt((x-b.x)*(x-b.x)+(y-b.y)*(y-b.y)) <= b.r + r) isAlive = false;   
  }
}
