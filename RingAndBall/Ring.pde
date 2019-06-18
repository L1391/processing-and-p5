class Ring {
  //position variables
  float x;
  float y;
  
  //radius variables
  float r;
  float dr;
  
  //change in radius loss (decceleration)
  float frictionLoss = 0.88;
  
  //is the ring active and showing
  boolean isShowing;
  
  Ring() {
    isShowing = false;
  }
  
  //draw circle with no fill (ring)
  void show() {
    stroke(255);
    noFill();
    ellipse(x , y, 2*r, 2*r);
  }
  
  void update() {
    if (isShowing) {
      show();
      
      //reduce change in radius
      dr *= frictionLoss;
      //change radius
      r += dr;
      
      //kill ring if it has slowed down enough
      if (dr < 0.5) {
        isShowing = false;
        dr = 0;
        r = 0;
      }
      
    }
    
    //create ring if mouse clicked
    if (mousePressed) {
        x = mouseX;
        y = mouseY;
        r = 0;
        dr = 15;
        isShowing = true;
     }
   
  }
  
}
