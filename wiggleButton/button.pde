class button {
  //physics variables
  float acceleration;
  float r;
  float dr;
  
  //position variables
  float x;
  float y;
  
  //initial size
  float size;
  
  //color constants
  int rK;
  int gK;
  int bK;
  
  //size limits
  float sizeMargin = 60;
  
  boolean mouseDown;
  int index;
      
  button(float size, float x, float y, int i) {
    this.size = size;
    r = size;
    
    this.x =x;
    this.y = y;
    
    index = i;
    
    //randomize color
    rK = (int) random(10, 100);
    gK = (int) random(10, 100);
    bK = (int) random(10, 100);
  }
  
  //draw ellipse with color, faded according to stretch
  void show() {
    fill(Math.abs(size-r) + rK, Math.abs(size-r) + gK, Math.abs(size-r) + bK);
    ellipse(x, y, r*2, r*2);
  }
  
  void applyPhysics() {
    //force arbitrarily proportional to stretch distance
    // -
    //dampening force arbitrarily proportional to dr
    acceleration = (size-r)/200 - dr/20;
    
    dr += acceleration;
    //neglect small velocities
    if (Math.abs(dr) < 0.001) dr = 0;
    
    //r is changed by dr times an arbitrary constant
    r += dr*15;  
  }
 
  void update() {
    show();

    //considered "clicked" if the mouse is pressed and is within the circle 
    if (mousePressed && (float) Math.sqrt((mouseX-x)*(mouseX-x) + (mouseY-y)*(mouseY-y)) <= r ) {
      mouseDown = true;
      dr = 0;
      selectedIndex = index;
    }
    if (!mousePressed) {
      mouseDown = false;
    }
  
    //let the user size the selected circle if the mouse is "clicked" 
    if (mouseDown && selectedIndex == index) {
       r = (float) Math.sqrt((mouseX-x)*(mouseX-x) + (mouseY-y)*(mouseY-y));
       
       //limit max and min size
       if (r > size + sizeMargin) r = size + sizeMargin;
       if (r < size - sizeMargin) r = size - sizeMargin;
       
    //run physics if user let go
    } else {
      applyPhysics();
    }   
  }
}
