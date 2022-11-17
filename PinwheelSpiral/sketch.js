const tileWidth = 5;

let startX = 0;
let startY = 0;

let takenCoords = [];

Array.prototype.containsArray = function(val) {
    var hash = {};
    for(var i=0; i<this.length; i++) {
        hash[this[i]] = i;
    }
    return hash.hasOwnProperty(val);
}

function setup() {
  createCanvas(1000, 1000);
  background(200,0,200);
}

function draw() {
  
  if (frameCount > 400) return;
  
  let direction = (frameCount-1) % 4;

  let cycle = ceil((frameCount-1) / 4);
  
  if (frameCount != 1) {
    if (direction % 2 == 0) {
    if (direction == 0) {
      startX = -cycle;
      startY = 0;
      
      while (!takenCoords.containsArray([startX,startY])) {
        startY--;
      }
      
      startY++;
        
    } else {
      startX = cycle;
      startY = 0;
      
      while (!takenCoords.containsArray([startX,startY])) {
        startY++;

              }
      
      startY--;

    }
  } else {
    if (direction == 1) {
      startX = 0;
      startY = cycle;
      
      if (frameCount != 2) {
         while (!takenCoords.containsArray([startX,startY])) {
        startX--;
      }
      
      startX++;
      }
      
      
    } else {
      startX = 0;
      startY = -cycle;
      
               while (!takenCoords.containsArray([startX,startY])) {
        startX++;
      }
      
      startX--;

    }
  }
  }

  let endX = 0;
  let endY = 0;
  
  
  if (direction % 2 == 0) {
    if (direction == 0) {
      endX = startX;
      endY = startY + (frameCount -1);
    } else {
      endX = startX;
      endY = startY - (frameCount -1);
    }
    
    
  } else {
    if (direction == 1) {
      endX = startX + (frameCount -1);
      endY = startY;
    } else {
      endX = startX - (frameCount -1);
      endY = startY;
    }
  }
  
  for (let i = 0; i <= abs(endX-startX); i++) {
    for (let j =0; j <= abs(endY-startY); j++) {
      takenCoords.push([Math.sign(endX-startX)*i+startX, Math.sign(endY-startY)*j+startY]);

    }
  }
  
  document.getElementById("seq").innerText += ", " + (abs(endX) + abs(endY));
  
  takenCoords.shift();

    
  strokeWeight(tileWidth/2);
  stroke((frameCount*10)%255);
  line(startX*tileWidth + width/2,startY*tileWidth+ width/2,endX*tileWidth+ width/2,endY*tileWidth+ width/2);
  
  
}