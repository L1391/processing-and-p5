class Button {
  //size variables
  float w;
  float h;
  
  //position variables of center of button
  float x;
  float y;
  
  //button display text
  String text;
  
  Button(float x, float y, float w, float h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    text = "";
  }
  
  Button(float x, float y, float w, float h, String text) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.text = text;
  }
  
  void update() {
    //change color of button on mouse hover
    if (mouseX < x + w/2 && mouseX > x - w/2 && mouseY < y+h/2 && mouseY > y -h/2) {
      fill(100);
    } else {
      fill(150);
    }
    
    //draw a rectangle with conversion of center position to corner position
    rect(x-w/2, y-h/2, w, h, 7);
    textSize(24);
    fill(255);
    text(text, x - w/4, y+5);
  }
  
  //is the mouse in the area of the rectangle and was the mouse pressed
  boolean isPressed() {
    return mouseX < x + w/2 && mouseX > x - w/2 && mouseY < y+h/2 && mouseY > y -h/2 && mousePressed;
  }
}
