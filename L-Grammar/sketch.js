let varsDict = ['A','B','C','D'];
let stepSizesDict = [8,10,13,14];
let anglesDict = [];
let constsDict = ['+','-','<','>'];

let vars, consts, stepSizes, angles, chars, rules, start,sentence;

// check if string contains any element of array
function stringContains(string, array) {
  for (let e of array) {
    if (string.indexOf(e) != -1) {
      return true;
    }
  }
  return false;
}

// insert character into string
function insertAt(string,c,index){
  return string.slice(0,index) + c + string.slice(index);
}

function newGrammar() {
  chars = "";
  rules = {};
  start = "";
  sentence = "";
  
    // generate vars
  vars = shuffle(varsDict).slice(0,random(2,varsDict.length+1));
  
  // generate consts
  consts = shuffle(constsDict).slice(0,random(1,constsDict.length+1));

  // only include < and > together
  if (consts.includes("<") && !consts.includes(">")) {
    consts.push(">");
  }
  if (!consts.includes("<") && consts.includes(">")) {
    consts.push("<");
  }
  
  chars = vars.join('') + consts.join('');

  // generate angle order
  angles = shuffle(anglesDict);
  // generate step size order
  stepSizes = shuffle(stepSizesDict);
  
  // generate random start
  var startlength = random(1,4);
  while (start.length < startlength) {
      start += chars.charAt(random(0,vars.length+1));
  }
  
  // make sure start contains a variable
  if (!stringContains(start,vars)) {
      start = insertAt(start,chars.charAt(random(0,chars.length)),random(0,start.length));
    }
  
  // generate rules
  for (const letter of vars) {
    var rulelength = random(2,7);
    var rule = "";

    
    while (rule.length < rulelength) {
      rule += chars.charAt(random(0,chars.length));
    }
    
    // make sure rule contains a variable
    if (!stringContains(rule,vars)) {
      rule = insertAt(rule,chars.charAt(random(0,chars.length)),random(0,rule.length));
    }
    
    rules[letter] = rule;
  }
  
  // map constants to themselves
  for (const op of consts) {
    rules[op] = op;
  }
  
  sentence = start;
  
  // update textbox
  document.getElementById("rules").textContent = JSON.stringify(rules);
  document.getElementById("seed").textContent = start;
}

function setup() {
  anglesDict = [PI/6, PI/3, PI/4, PI/2];

  newGrammar();
  
  createCanvas(2000, 2000);
  frameRate(4);
}



function draw() {
  // stop at large sentence
  if (sentence.length > 100000) return;
  
  background(220);
  
  // start each sentence at center
  let curX = width/2;
  let curY = height/2;
  let curA = 0;
  let posstack = [];
  let anglestack = [];
  
  var newSentence = "";
  
  // parse current sentence and construct next sentence
  for (let i=0; i<sentence.length; i++) {
    var letter = sentence.charAt(i);
    
    // get step size if variable
    var step = vars.indexOf(letter);
    if (step == -1) {
      step = 0;
    } else {
      step = stepSizes[step];
    }
    
    // get position change
    var dX = step*cos(curA);
    var dY = step*sin(curA);
    
    // get angle step size if constant
    var dA = consts.indexOf(letter);
    if (dA == -1) {
      dA = 0;
    } else {
      dA = angles[dA];
    }
    
    newSentence += rules[letter];
    
    // act based on current letter
    switch (letter) {
      case "A":
        stroke(0,100,0);
        line(curX,curY,curX+dX,curY+dY);
        curX += dX;
        curY += dY; 
        break;
      case "B":
        stroke(0,255,0);
        line(curX,curY,curX+dX,curY+dY);
        curX += dX;
        curY += dY;  
        break;
      case "C":
        stroke(50,200,0);
        line(curX,curY,curX+dX,curY+dY);
        curX += dX;
        curY += dY; 
        break;        
      case "D":
        circle(curX,curY,5);
        break;
      case "+":
        curA += dA;
        break;
      case "-":
        curA -= dA;
        break;
      case "<":
        posstack.push([curX,curY]);
        anglestack.push(curA);
        break;
      case ">":
        if (posstack.length == 0) break;
        
        var pos = posstack.pop();
        curX = pos[0];
        curY = pos[1];
        curA = anglestack.pop();
        break;
    }
  }
  
  // remove useless operations
  newSentence = newSentence.replace("<>","");
  
  sentence = newSentence;
  
}