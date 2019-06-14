//400m time
float lapSeconds = 60;

//time variables
float framerate = 20;
float timer = 0;

//track to scale, 1px = 1m
track track = new track(100, 100);
runner runner = new runner(lapSeconds);

void setup() {
  frameRate(framerate);
  size(200, 200);
  
  background(0);
  track.show();
  text(timer, 50, 150); 
}

void draw() {
  background(0);
  track.show();
  runner.show();
  runner.move();
  
  //timer text
  fill(255);
  textSize(10);
  text(timer, 50, 150);
  //make the time increment accordingly in seconds despite framerate
  timer += 1/framerate;
}