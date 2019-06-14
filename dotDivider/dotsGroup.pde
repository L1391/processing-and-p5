class dotsGroup {
  Dot[] dots;
  
  //index of extreme dot
  int extremeRightDot = 0;
  //index of other dot on dividing line
  int dividerDot = 2;
  
  //line constants
  float slope;
  float intercept;
  
  //create array of indexed dots
  dotsGroup(int size) {
    dots = new Dot[size];
    for (int i = 0; i< size; i++) {
      dots[i] = new Dot();
    }
  }
  
  
  void show() {
    for (int i = 0; i< dots.length; i++) {
      dots[i].show();
    }
    drawLine();
  }
  
  //find the extreme right most dot
  void setExtreme() {
    float max = 0;
    int maxIndex = 0;
    
    for (int i=0; i<dots.length; i++) {
      if (dots[i].pos.x > max) {
        max = dots[i].pos.x;
        maxIndex = i;
      }
    }
    
    extremeRightDot = maxIndex;
    dots[extremeRightDot].dotType = 0;
    
  }
  
  void setDivider() {
    int dotsUnder = 0;
    int dotsOver = 0;
    
    //loop to test each dot if it is the divider
    for (int i=0; i<dots.length; i++) {
      
      dotsUnder = 0;
      dotsOver = 0;
      
      if (i != extremeRightDot){
        
        //get equation for the line and create an inequality
        slope = (dots[extremeRightDot].pos.y - dots[i].pos.y)/(dots[extremeRightDot].pos.x - dots[i].pos.x);
        intercept = dots[extremeRightDot].pos.y - slope*dots[extremeRightDot].pos.x;
        System.out.println(slope + " " + intercept);
        
        //now compare the line y with the other dots' y to check if it divides correctly
        for (int j=0; j<dots.length; j++)
          if (j != extremeRightDot && j != i) {
            
            //if the dot is below the line (greater y value)
            if (dots[j].pos.y > (slope*dots[j].pos.x) + intercept) {
              dotsUnder++;
              dots[j].dotType = 1;
            } else {
              dotsOver++;
              dots[j].dotType = 2;
            }
            
                
          }
        }
        
        //check if the dots under is equal to the (size-2)/2 and there are not 3 collinear dots
        System.out.println(dotsUnder);
        if (dotsUnder == (dots.length - 2)/2 && dotsUnder == dotsOver) {
          dividerDot = i;
          dots[dividerDot].dotType = 0;
          break;
        }
      }
    }
  
 
  void drawLine() {
  line(0, intercept, 300, slope*300 + intercept);
  }
  
}