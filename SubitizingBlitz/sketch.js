//maximum number of stones per round
var highestNumberSucceeded = 3;

//variables for displaying different screens at certain times
var newRound;
var roundStartFrameCount;
var roundEndFrameCount = 0;

//stone object
var stones;

//button object
var buttonOne;
var buttonTwo;
var buttonThree;

function setup() {
  frameRate(20);
  createCanvas(400, 400);
  newRound = true;

  //display instructions
  background(0);
  textSize(24)
  fill(255);
  text("Quick! How many stones do you see?", width / 2 - 200, height / 2);

}

/** STONE GROUP*/
class StoneGroup {

  constructor(num) {
    //stone positions and quantities
    this.num = num;
    this.xpos = [];
    this.ypos = [];

    //add distinct points
    for (var i = 0; i < num; i++) {
      var x = int(random(10, width - 10));
      while (this.xpos.includes(x)) {
        x = int(random(10, width - 10));
      }
      this.xpos.push(x);
    }

    for (var i = 0; i < num; i++) {
      var y = int(random(10, height - 80));
      while (this.ypos.includes(y)) {
        y = int(random(10, height - 80));
      }
      this.ypos.push(y);
    }
  }

  show() {
    //render stones as circles
    fill(255);
    for (var i = 0; i < this.num; i++) {
      circle(this.xpos[i], this.ypos[i], 20);
    }
  }
}

/** BUTTON */

class Button {

  constructor(x, y, w, h, text) {
    //button size
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.text = text;
  }

  update() {
    //change color of button on mouse hover
    if (mouseX < this.x + this.w / 2 && mouseX > this.x - this.w / 2 && mouseY < this.y + this.h / 2 && mouseY > this.y - this.h / 2) {
      fill(100);
    } else {
      fill(150);
    }

    //draw a rectangle with conversion of center position to corner position
    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 7);
    textSize(24);
    fill(255);
    text(this.text, this.x - this.w / 4, this.y + 5);
  }

  //is the mouse in the area of the rectangle and was the mouse pressed
  isPressed() {
    return mouseX < this.x + this.w / 2 && mouseX > this.x - this.w / 2 && mouseY < this.y + this.h / 2 && mouseY > this.y - this.h / 2 && mouseIsPressed;
  }
}

function draw() {

  //generate new stones and buttons each round
  if (newRound) {

    //let instructions and text display for 1.5 seconds before each round
    if (frameCount - roundEndFrameCount > 30) {
      stones = new StoneGroup(int(random(highestNumberSucceeded - 2, highestNumberSucceeded + 1)));

      //generate random unique numbers + or - 2 from the actual number of stones
      var guessNumbers = [stones.num, ];
      for (var i = 0; i < 2; i++) {
        var num = stones.num + int(random(-2, 3));
        while (guessNumbers.includes(num)) {
          num = stones.num + int(random(-2, 3));
        }

        guessNumbers.push(num);
      }
      guessNumbers = shuffle(guessNumbers);

      //render the new objects
      background(0);
      stones.show();

      buttonOne = new Button(100, height - 40, 90, 60, String(guessNumbers[0]));
      buttonTwo = new Button(200, height - 40, 90, 60, String(guessNumbers[1]));
      buttonThree = new Button(300, height - 40, 90, 60, String(guessNumbers[2]));

      //start the round
      roundStartFrameCount = frameCount;
      newRound = false;
    }

  } else {
    //give 4 seconds to click the right answer
    if (frameCount - roundStartFrameCount > 80) {
      fill(255, 0, 0);
      text("Too slow human-brain!", width / 2 - 150, height / 2);

      //decrement maximum stones to make it easier
      if (highestNumberSucceeded > 3) {
        highestNumberSucceeded--;
      }
      roundEndFrameCount = frameCount;
      newRound = true;

    } else {
      var guess = -1;

      //render buttons on hover
      buttonOne.update();
      buttonTwo.update();
      buttonThree.update();

      //check if and which button is pressed
      if (buttonOne.isPressed()) {
        guess = parseInt(buttonOne.text);
      } else if (buttonTwo.isPressed()) {
        guess = parseInt(buttonTwo.text);
      } else if (buttonThree.isPressed()) {
        guess = parseInt(buttonThree.text);
      }

      //check if the guesss was correct
      if (guess != -1) {
        if (guess == stones.num) {
          //show success message and increase difficulty
          fill(0, 255, 0);
          text("Good job monkey-brain", width / 2 - 150, height / 2);
          roundEndFrameCount = frameCount;
          highestNumberSucceeded++;
          newRound = true;

        } else {
          //show failure message and decrease difficulty
          fill(255, 0, 0);
          text("Not right human-brain", width / 2 - 150, height / 2);
          roundEndFrameCount = frameCount;
          if (highestNumberSucceeded > 3) {
            highestNumberSucceeded--;
          }
          newRound = true;
        }
      }
    }
  }
}