class Leaf {
  //axis to float down around 
  float originalx;
  
  //position variables
  float x;
  float y;
  
  //size variables
  float size;
  float maxSize;
  
  //internal clock variables
  float count;
  float fallCount; 
  boolean isReadyToFall;
  
  //color variables
  float leafGreen;
  float minGreen;
  
  Leaf() {
    spawn();
  }
  
  //reset leaf
  void spawn() {
    isReadyToFall = false;
    size = 4;
    maxSize = random(9, 15);
    count = 0;
    fallCount = random(15, 400);
    leafGreen = 255;
    minGreen = random(20, 100);
    
    //put leaf randomly on tree ellipse
    originalx = random(0, 400);
    x = originalx;
    y = (float) Math.sqrt((40000-(x-200)*(x-200))/5) * random(-1,1) + 100;
  }
  
  void show() {
    //draw ellipse
    strokeWeight(1);
    stroke(0);
    fill(255-leafGreen, leafGreen, 0);
    ellipse(x, y, 1.2*size, size);
  }
  
  void update() {

    if (!isReadyToFall) {
       //grow until individual growth limit reached
      if (size < maxSize) {
      size += random(0, 0.2);
      
      }
      
      // become less green until individual limit reached
      if (leafGreen > minGreen) {
      leafGreen -= random(0, 3);
      }
     
      //start falling when count limit reached
      if (count >= fallCount && size >= maxSize ) {
        //to start fall smoothly
        count = -PI;
        isReadyToFall = true;
      }
    }
     
    //fall, slowing down on the edges
    if (isReadyToFall) {
      y+= sin(count) + 1;
      x = 20*cos(count/2) + originalx;
    }
    
    //reset when at bottom
    if (y >= height) {
      spawn();
    }
    
    //increment leaf internal clock
    count += 0.1; 
  }
 
  
}