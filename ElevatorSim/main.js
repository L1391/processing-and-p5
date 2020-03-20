//number of floors for the elevator
let floors = 6;
//maximum people supported by the elevator
let elevatorCapacity = 5;

//total people
let people = 3;
let pGlobal = new Array(people);

//people on floors organized in queues
let pOnFloorsGlobal = new Array(floors);

var windowX = 400;
var windowY = 400;

/** Global Classes */

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Queue datatype class for people lines
class Queue {
  
    constructor() {
      this.array = new Array();
    }
    
    getLength() {
     return this.array.length;
    }
    
    //add item
    enqueue(object) {
      this.array.push(object);
    }
    
    //get first item and shrink list
    dequeue() {
       var slicedItem = this.array[0];
       this.array = this.array.slice(1,this.array.length); //why is this affecting the global scope??!!
       return slicedItem;
       //return this.array.splice(0,1);
    
    }
    
    getFirst() {
     return this.array[0]; 
    }
    
    index(object) {
      return this.array.indexOf(object);
    }
  }

  

  // Person class
class Person {
  
    constructor(pOnFloorsParam, originalToCopy) {
      this.diameter = windowY/floors/4;
      
     if (originalToCopy === undefined) {
      this.spawn(pOnFloorsParam)
     } else {
      this.spawn(pOnFloorsParam, originalToCopy);
     }
  
    }

    
    //draw circle representing person
    show(i, s) {
     // console.log("showing");
      s.fill(this.red, this.green, this.blue);
      s.circle(this.x,this.y - this.diameter/2,this.diameter);
      s.fill(0);
      s.text(i, this.x - this.diameter/4, this.y -this.diameter/4);
      
      if (!this.done) this.count++;
  
    }
    
    //create new version of person
    spawn(pOnFloorsParam, originalToCopy) {
      this.done = false;
      this.count = 0;

     if (originalToCopy === undefined) {
      this.startFloor = random(1,floors);
      this.endFloor = random(1,floors);
      
      while (this.startFloor == this.endFloor) this.endFloor = random(1,floors);
      this.direction = Math.sign(this.endFloor - this.startFloor);
      
      this.red = random(0,255);
      this.green = random(0,255);
      this.blue =  random(0,255);
      
      } else {
        this.startFloor = originalToCopy.startFloor;
        this.endFloor = originalToCopy.endFloor;

        this.direction = Math.sign(this.endFloor - this.startFloor);

        this.red = originalToCopy.red;
        this.green = originalToCopy.green;
        this.blue = originalToCopy.blue;

      }
      pOnFloorsParam[this.startFloor - 1].enqueue(this);
      this.x = windowX/2 + pOnFloorsParam[this.startFloor - 1].index(this)*this.diameter;
      

      this.y = windowY/(floors) * this.startFloor;
    }
    
    //go onto the elevator horizontally
    board() {
      this.x = windowX/8;
    }
    
    //go off of the elevator horizontally
    unboard() {
      this.x = windowX/2;
      this.done = true;
      //this.spawn(this.p);
    }
    
    //move vertically to a new floor
    moveToFloor(floor) {
          this.y = windowY/(floors) * floor;
    }
    
  }

  // Elevator class
class Elevator {
  
    constructor() {
      this.currentFloor = 1;
      this.x = 0;
      this.y = windowY/(floors)*(this.currentFloor -1);
      //positive is down, higher floors are down
      this.direction = 1;
    }
    
    show(s) {
      s.fill(200);
      s.rect(this.x, this.y, windowX/4,windowY/(floors));
    }
    
    //move the elevator to a floor and update direction
    move(toFloor, pOnElevatorParam) {
      this.y = windowY/(floors) * (toFloor-1);
      this.direction = Math.sign(toFloor - this.currentFloor);
      
      this.currentFloor = toFloor;
      for(i = 0; i < pOnElevatorParam.length; i++) {
        pOnElevatorParam[i].moveToFloor(toFloor);
        //console.log( i + " move to " + toFloor);

      }
    }
    
    //move as many people onto elevator and update arrays
    boardPeople(pOnFloorsParam, pOnElevatorParam) {
      for(i = pOnFloorsParam.getLength()-1; i >= 0; i--) {
        if(pOnElevatorParam.length < elevatorCapacity) {
          pOnFloorsParam.getFirst().board();
        
          pOnElevatorParam.push(pOnFloorsParam.dequeue());
      
        }
      }
    }
    
    //move all people off elevator if at correct floor and update arrays
    unboardPeople(pOnElevatorParam) {
      for(i = pOnElevatorParam.length - 1; i >= 0; i--) {
        if (pOnElevatorParam[i].endFloor == this.currentFloor) {
          pOnElevatorParam[i].unboard();
          pOnElevatorParam.splice(i,1);
        }
      }
    }
  }

//initialize global p arrays  
for (i = 0; i<floors; i++) {
    pOnFloorsGlobal[i] = new Queue();
}

for (i = 0; i < pGlobal.length; i++) {
    pGlobal[i] = new Person(pOnFloorsGlobal);
}


/** Sketch instances */

//majority direction model
var majDirSketch = function(s) {
  s.p = new Array(people);
  s.pOnFloors = [];
  s.pOnElevator = [];
  s.e = new Elevator();

  s.count = 0;
  s.majDir = 0;

  s.updateParams = function() {
      s.count = 0;
      s.majDir = 0;
      s.e = new Elevator();
     
      for (i = 0; i<floors; i++) {
        s.pOnFloors[i] = new Queue();
      }
       s.p = pGlobal.map(a => Object.assign(new Person(s.pOnFloors, a), a));

      s.frameRate(1);
  }

  s.setup = function() {
      s.canvas = s.createCanvas(windowX, windowY);
      s.canvas.parent("canvasParent");
      s.canvas.style("display", "inline");

      s.updateParams();
  }

  s.draw = function() {
      s.running = false;

      s.background(255);
      for(i = 1; i<=floors; i++) {
          s.line(s.width/4, s.height/floors * i, s.width, s.height/floors * i);
      }
      s.e.move(s.e.currentFloor + s.majDir, s.pOnElevator);
      s.e.show(s);

      s.e.unboardPeople(s.pOnElevator);
      s.e.boardPeople(s.pOnFloors[s.e.currentFloor - 1], s.pOnElevator);

      for (i = 0; i < s.p.length; i++) {
          s.p[i].show(i,s);
          if (!s.p[i].done) s.running = true;
      }

      s.count++;

      //get the majority direction of people on the elevator
          s.majDir = 0;
          for(i = 0; i<s.pOnElevator.length; i++) {
            s.majDir += s.pOnElevator[i].direction;
          }
          s.majDir=Math.sign(s.majDir);

          //if no majority seek a floor with people
          if (s.majDir == 0) {
            for (i = 0; i < s.pOnFloors.length; i++) {
              if (s.pOnFloors[i].getLength() > 0) {
                s.majDir = Math.sign((i + 1) - s.e.currentFloor);
                break;
              }
            }
          }

          //if no floors with people, go to the closest floor request from elevator
          if (s.majDir == 0) {
            s.closestFloor = 50;
            for (i = 0; i< s.pOnElevator.length; i++) {
              if (Math.abs(s.pOnElevator[i].endFloor - s.e.currentFloor) < Math.abs(s.closestFloor - s.e.currentFloor)) s.closestFloor = s.pOnElevator[i].endFloor;
            }
    
            s.majDir = Math.sign(s.closestFloor - s.e.currentFloor);
          }


          if (!s.running) {
            var results = "Finished in " + s.count + " moves";
            for (i = 0; i < s.p.length; i++) {
            results += "<br> Person " + i + " waited for " + s.p[i].count + " counts";
            }
  
            document.getElementById("majDirResults").innerHTML = results;
            s.frameRate(0);
        }


  }

}

//seek people model
var seekPSketch = function(s2) {
  s2.p = new Array(people);
  s2.pOnFloors = [];
  s2.pOnElevator = [];
  s2.e = new Elevator();

  s2.count = 0;
  s2.majDir = 0;

  s2.updateParams = function() {
      s2.count = 0;
      s2.majDir = 0;
      s2.e = new Elevator();
     
      for (i = 0; i<floors; i++) {
        s2.pOnFloors[i] = new Queue();
      }
       s2.p = pGlobal.map(a => Object.assign(new Person(s2.pOnFloors, a), a));

      s2.frameRate(1);
  }

  s2.setup = function() {
      s2.canvas = s2.createCanvas(windowX, windowY);
      s2.canvas.parent("canvasParent");
      s2.canvas.style("display", "inline");

      s2.updateParams();
  }

  s2.draw = function() {
      s2.running = false;

      s2.background(255);
      for(i = 1; i<=floors; i++) {
          s2.line(s2.width/4, s2.height/floors * i, s2.width, s2.height/floors * i);
      }
      s2.e.move(s2.e.currentFloor + s2.majDir, s2.pOnElevator);
      s2.e.show(s2);

      s2.e.unboardPeople(s2.pOnElevator);
      s2.e.boardPeople(s2.pOnFloors[s2.e.currentFloor - 1], s2.pOnElevator);

      for (i = 0; i < s2.p.length; i++) {
          s2.p[i].show(i,s2);
          if (!s2.p[i].done) s2.running = true;
      }

      s2.count++;


          s2.majDir = 0;
        //find a floor with people
        if (s2.pOnElevator.length != elevatorCapacity) {
          for (i = 0; i < s2.pOnFloors.length; i++) {
            if (s2.pOnFloors[i].getLength() > 0) {
              s2.majDir = Math.sign((i + 1) - s2.e.currentFloor);
              break;
            }
          }
        }

          //if no floors with people, go to the closest floor request from elevator
          if (s2.majDir == 0) {
            s2.closestFloor = 50;
            for (i = 0; i< s2.pOnElevator.length; i++) {
              if (Math.abs(s2.pOnElevator[i].endFloor - s2.e.currentFloor) < Math.abs(s2.closestFloor - s2.e.currentFloor)) s2.closestFloor = s2.pOnElevator[i].endFloor;
            }
    
            s2.majDir = Math.sign(s2.closestFloor - s2.e.currentFloor);
          }

          if (!s2.running) {
            var results = "Finished in " + s2.count + " moves";
            for (i = 0; i < s2.p.length; i++) {
            results += "<br> Person " + i + " waited for " + s2.p[i].count + " counts";
            }
  
            document.getElementById("seekPResults").innerHTML = results;
            s2.frameRate(0);
        }


  }

}


//linear model
var linearSketch = function(s1) {
   s1.p = [];
   s1.pOnFloors = new Array(floors);
   s1.pOnElevator = [];
   s1.e = new Elevator();

   s1.count = 0;
   s1.dir = 1;

  s1.updateParams = function() {
       s1.count = 0;
       s1.dir = 0;
       s1.e = new Elevator();

       //initialize global p arrays  
      for (i = 0; i<floors; i++) {
        s1.pOnFloors[i] = new Queue();
      }
       s1.p = pGlobal.map(a => Object.assign(new Person(s1.pOnFloors, a), a));

      s1.frameRate(1);
  }

  s1.setup = function() {
      s1.canvas = s1.createCanvas(windowX, windowY);
      s1.canvas.parent("canvasParent");
      s1.canvas.style("display", "inline");

      s1.updateParams();
  }

  s1.draw = function() {
       s1.running = false;

      s1.background(255);
      for(i = 1; i<=floors; i++) {
          s1.line(s1.width/4, s1.height/floors * i, s1.width, s1.height/floors * i);
      }

       s1.e.move(s1.e.currentFloor +  s1.dir,  s1.pOnElevator);
       s1.e.show(s1);

       s1.e.unboardPeople(s1.pOnElevator);
       s1.e.boardPeople(s1.pOnFloors[s1.e.currentFloor - 1], s1.pOnElevator);

      for (i = 0; i <  s1.p.length; i++) {
        s1.p[i].show(i, s1);

       if (!s1.p[i].done)  s1.running = true;
      } 



      if ( s1.e.currentFloor == floors)  s1.dir = -1;
      if ( s1.e.currentFloor == 1)  s1.dir = 1;

       s1.count++;

      if (! s1.running) {
          var results = "Finished in " +  s1.count + " moves";
          for (i = 0; i < s1.p.length; i++) {
          results += "<br> Person " + i + " waited for " +  s1.p[i].count + " counts";
          }

          document.getElementById("linearResults").innerHTML = results;
          s1.frameRate(0);
      }
  }

}


/** Master code */
var p5linear = new p5(linearSketch);
var p5majDir = new p5(majDirSketch);
var p5seekP = new p5(seekPSketch);

function updateParams() {
    floors = parseInt(document.getElementById("floors").value);
    people = parseInt(document.getElementById("people").value);
    elevatorCapacity = parseInt(document.getElementById("elevatorCapacity").value);

    pOnFloorsGlobal = new Array(floors);
    pGlobal = new Array(people);
  
    for (i = 0; i<floors; i++) {
      pOnFloorsGlobal[i] = new Queue();
    }

    for (i = 0; i < pGlobal.length; i++) {
      pGlobal[i] = new Person(pOnFloorsGlobal);
    }

    p5majDir.updateParams();
    p5linear.updateParams();
    p5seekP.updateParams();

}


