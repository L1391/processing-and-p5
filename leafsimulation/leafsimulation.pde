
Leaf[] leaves = new Leaf[600];

void setup() {
  size(400, 400);
  for (int i = 0; i < leaves.length; i++) {
    leaves[i] = new Leaf();
    leaves[i].show();
  }
  
}

void draw() {
  background(0);
  
  //draw tree
  strokeWeight(2);
  stroke(50,50,50);
  fill(50,50,50);
  //trunk
  rect(175, 100, 50, 300);
  //branches
  for (float i = PI-PI/6; i < TWO_PI+PI/6; i += 0.1) {
    line(200, 100, 170*cos(i)+200, 100*sin(i)+120);
  }
  
  //draw leaves
   for (int i = 0; i < leaves.length; i++) {
    leaves[i].update();
    leaves[i].show();
  } 
  
}