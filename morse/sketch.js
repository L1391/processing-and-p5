//count to measure time between taps
let prevCount;
//boolean for first instance space down
let keyWasPressed = false;
//boolean for first space between morse letters
let space = false;

//string of morse input
let letter = "";
//array of separate morse letters
let letters = {};
//string of final translated phrase
let phrase = "";

//morse translations
const morse = [
  ['a', ".-"],
  ['b', "-..."],
  ['c', "-.-."],
  ['d', "-.."],
  ['e', "."],
  ['f', "..-."],
  ['g', "--."],
  ['h', "...."],
  ['i', ".."],
  ['j', ".---"],
  ['k', "-.-"],
  ['l', ".-.."],
  ['m', "--"],
  ['n', "-."],
  ['o', "---"],
  ['p', ".--."],
  ['q', "--.-"],
  ['r', ".-."],
  ['s', "..."],
  ['t', "-"],
  ['u', "..-"],
  ['v', "...-"],
  ['w', ".--"],
  ['x', "-..-"],
  ['y', "-.--"],
  ['z', "--.."],
  ['0', "-----"],
  ['1', ".----"],
  ['2', "..---"],
  ['3', "...--"],
  ['4', "....-"],
  ['5', "....."],
  ['6', "-...."],
  ['7', "--..."],
  ['8', "---.."],
  ['9', "----."],
  ['.', ".-.-.-"],
  [' ', "......."]
];

//morse beep
let sound;

function setup() {
  background(0);
  createCanvas(400, 400);
  frameRate(15);
  sound = new p5.TriOsc();
  sound.start();
  sound.amp(0);
}

function draw() {
  background(0);
          
  textAlign(CENTER);
  textSize(20); 
  text(phrase, width/2, height/2-20);
  
  //show circle when key down
  if (keyIsPressed == true) {
    fill(255);
    circle(width/2, height/2, 10);
  }
  
  //start tracking count at the start of key down
  if (keyIsPressed == true && keyWasPressed == false) {
    prevCount = frameCount;
    sound.freq(midiToFreq(60));
    sound.fade(0.5,0.05);
    keyWasPressed = true;
    space = false;
  }
  
  //after typing, wait 30 counts until final translation 
  if (frameCount - prevCount > 30 && letter != "" && keyWasPressed == false) {
    
    phrase = "";
    
    letters = letter.split(" ");
    
    //refer to array to translate
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < morse.length; j++) {
        if (morse[j][1] == letters[i])  {
          phrase = phrase.concat(morse[j][0]);
        }
      }
    }

    letter = "";
    //wait 8 counts between inputs before putting one space to distinguish a new morse character 
  } else if (frameCount - prevCount > 8 && letter != "" && keyWasPressed == false && !space) {
    letter = letter.concat(" ");
    print ("space");
    space = true;
  }
    
}

//add . or - based on counts between down and release
function keyReleased() {
    sound.fade(0,0.05);
  
    let currentCount = frameCount;
    let difference = currentCount - prevCount;
  
  //add - after 3 counts, else add .
    if (difference >= 3) {
      letter = letter.concat("-");
      print ("-");
    } else {
      letter = letter.concat(".");
      print (".");
    }
  
  prevCount = frameCount;
  keyWasPressed = false;
  
  return false
}

