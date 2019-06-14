
class Dot {
  //position variable
  PVector pos;
  
  //type for visualizer
  int dotType;
  
  Dot() {
    pos = new PVector(random(0,300), random(0,300));
    
  }
  
  Dot(float x, float y) {
    pos = new PVector(x, y);
    
  }
  
  void show() {
    //differentiate dots by color and size for easier discerning
      if (dotType == 1) {
        fill(0,255,0);
        ellipse(pos.x, pos.y, 4, 4);
        
      } else if (dotType == 2){
        fill (255,0,0);
        ellipse(pos.x, pos.y, 4, 4);
        
      } else {
        fill (0,0,255);
        ellipse(pos.x, pos.y, 6, 6);
      }
      
  }
  
}