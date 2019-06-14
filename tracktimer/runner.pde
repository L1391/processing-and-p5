class runner {
  //speed for straights
  float linearSpeed;
  
  //speed for curves
  float rotationalSpeed;
  
  //position variable
  PVector pos;
  
  //change curve position based on a changing angle
  float angle;
  
  runner(float secToLap) {
    pos = new PVector(track.pos.x + 42.195, track.pos.y + 36.5);
    //calculate speeds based on 400m track
    linearSpeed = (400/secToLap);
    rotationalSpeed = (linearSpeed/36.5);
    
    //start circle at 3PI/2 (always running counter-clockwise)
    angle = PI+HALF_PI;
  }
  
  void show() {
    //draw circle
    stroke(0, 0, 255);
    fill(0, 0, 255);
    ellipse(pos.x, pos.y, 5, 5);
  }
  
  //all movements must be divided by framrate to keep speed consistent but smoother
  void move() {
    //right curve (circle)
    if (pos.x >= track.pos.x + 42.195) {
      angle += rotationalSpeed/framerate;
      pos.x = track.pos.x + 42.195 + cos(angle)*36.5; 
      pos.y = track.pos.y - sin(angle)*36.5; 
      
     //left curve (circle)
    } else if (pos.x <= track.pos.x - 42.195) {
      angle += rotationalSpeed/framerate;
      pos.x = track.pos.x - 42.195 + cos(angle)*36.5; 
      pos.y = track.pos.y - sin(angle)*36.5; 
      
     //top straight
    } else if (pos.y < track.pos.y){
      pos.x -= linearSpeed/framerate;
      
     //bottom straight
    } else if (pos.y > track.pos.y){
      pos.x += linearSpeed/framerate;
    }
  }
  
}