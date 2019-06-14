button b[] = new button[10];

//the one button being sized
int selectedIndex;

void setup() {
  size(600, 600);
  background(0);
  //generate random buttons
  for (int i = 0; i<b.length; i++) {
    b[i] = new button(random(40, 150), random(20, width-20), random(20, height-20), i);
  }
}

void draw() {
  background(0);
  //update all buttons
  for (int i = 0; i<b.length; i++) {
    b[i].update();
  }
  
}