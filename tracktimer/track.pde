 class track {
   //position variable
   PVector pos;
   
   track(float x, float y) {
     pos = new PVector(x, y);
   }
   
   void show() {
     //straights
     stroke(255, 0 ,0);
     line(pos.x-42.195, pos.y+36.5, pos.x+42.195, pos.y+36.5);
     line(pos.x-42.195, pos.y-36.5, pos.x+42.195, pos.y-36.5);
     //curves
     noFill();
     arc(pos.x-42.195, pos.y, 73, 73, HALF_PI, PI+HALF_PI);
     noFill();
     arc(pos.x+42.195, pos.y, 73, 73, PI+HALF_PI, TWO_PI+HALF_PI);
   }
   
 }