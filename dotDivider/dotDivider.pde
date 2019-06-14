
//This numebr must be an even greater than 2
dotsGroup group = new dotsGroup(50);

void setup() {
  size(300, 300);
  frameRate(100);
  
  //find 
  group.setExtreme();
  group.setDivider();
  
  //draw visualizer
  background(255);
  group.show();
}