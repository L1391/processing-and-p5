const K = 9000;
const E_CHARGE = 1;
const SPEED = 200;
const MAX_VEL = 10;
const DAMP = 400;

var numMol = 10;
var currentMol = null;
let molecules = Array(numMol);

      
function IonIonForce(q1,q2, d) {
  return q1 * q2 * K / (d*d);
}

class Atom {
  constructor(r, mass, protons, electrons) {
    this.r = r;
    this.mass = mass;
    this.protons = protons;
    this.electrons = electrons;
    this.x = 0;
    this.y = 0;
        
    this.color = protons/(protons+electrons)*255;
  }
  
  update(x, y) {
    this.x = x;
    this.y = y;
  } 
  
  show() {
    fill(this.color);
    circle(this.x, this.y, 2*this.r);
  }
  
}

class Molecule {
  
  constructor(id, x, y, angle) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
    
    this.xv = 0;
    this.yv = 0;
    this.xa = 0;
    this.ya = 0;
    this.av = 0;
    this.aa = 0;
    
    this.atoms = [];
    this.relpos = [];
    this.mass = 0;
    this.r = 0;
    
    this.firstCol = new Array(numMol).fill(true);
    
  }
  
  addAtom(newAtom, relx, rely) {
    this.atoms.push(newAtom);
    this.mass += newAtom.mass;
    this.relpos.push([relx,rely]);
        
    let relangle = atan2(rely, relx);
    let mag = sqrt(relx*relx + rely*rely);
    
    newAtom.update(this.x + sin(PI/2 - relangle + this.angle) * mag, this.y + cos(PI/2 - relangle + this.angle) * mag);
    
    if (mag + newAtom.r > this.r) {this.r = mag + newAtom.r;}
    
  }
  
  show() {
    this.atoms.forEach((a) => {
      a.show();
    });
  }
  
  searchCollisions(fromI) {
    let colMol = [];
    let startIndex = 0;
    
    while(this.firstCol.indexOf(false,startIndex) != -1 && this.firstCol.indexOf(false, startIndex) != fromI && this.firstCol.indexOf(false, startIndex) != this.id) {
      let colMolI = this.firstCol.indexOf(false,startIndex);
      colMol.push(molecules[colMolI]);
      
      if (colMolI > startIndex) {
        startIndex = colMolI + 1;
      } else {
        startIndex++;
      }      
      
      let newSearch = molecules[colMolI].searchCollisions(this.id)
      
      if (newSearch.length != 0) {
        newSearch.forEach((m) => {
          colMol.push(m);  
        });
      }
    }
    
    
    return colMol;

  }
  
  checkCollision(otherMolecule) {
    let colCount = 0;
    
    this.atoms.forEach((a1, i, array1) => {
     otherMolecule.atoms.forEach((a2,j, array2) => {
        let dx = a2.x - a1.x;
        let dy = a2.y - a1.y;
        let dist = sqrt(dx*dx + dy*dy);
         
       if (dist < a1.r + a2.r) {  
         colCount++;
         
         let colMols = this.searchCollisions(this.id);
         
         colMols.push(this);
         let px = 0;
         let py = 0;
         let totalMass = 0;
         
         colMols.forEach((m) => {
           px += m.mass*m.xv;
           py += m.mass*m.yv;
           totalMass += m.mass
         });
         
         colMols.forEach((m) => {
           m.xv = px/totalMass;
           m.yv = py/totalMass;
           m.av = 0;
         });
         
//          let newxv = (this.mass*this.xv + otherMolecule.mass*otherMolecule.xv)/(this.mass + otherMolecule.mass);
//          let newyv = (this.mass*this.yv + otherMolecule.mass*otherMolecule.yv)/(this.mass + otherMolecule.mass);
         
//          this.xv = newxv;
//          otherMolecule.xv = newxv;
//          this.yv = newyv;
//          otherMolecule.yv = newyv;
         
//          this.av = 0;
//          otherMolecule.av = 0;
         
         if (this.firstCol[otherMolecule.id]) {
           this.xa = 0;
           this.ya = 0;
           this.aa = 0;
           otherMolecule.xa = 0;
           otherMolecule.ya = 0;
           otherMolecule.aa = 0;
           this.firstCol[otherMolecule.id] = false;
           otherMolecule.firstCol[this.id] = false;
         }
         
       } 
      });
    });
    
    if (colCount == 0 && !this.firstCol[otherMolecule.id]) {
      this.firstCol[otherMolecule.id] = true;
    }
     
  }
  
  calculateForceCouple(otherMolecule) {
    let xf = 0;
    let yf = 0;
    let af = 0;
    
    this.atoms.forEach((a1, i, array1) => {
      
     otherMolecule.atoms.forEach((a2,j, array2) => {
        let dx = a2.x - a1.x;
        let dy = a2.y - a1.y;
        let dist = sqrt(dx*dx + dy*dy);
          
        
        let ppf = IonIonForce(a1.protons*E_CHARGE, a2.protons*E_CHARGE, dist);
        let pef = IonIonForce(a1.protons*E_CHARGE, -a2.electrons*E_CHARGE, dist - a2.r);
        let epf = IonIonForce(-a1.electrons*E_CHARGE, a2.protons*E_CHARGE, dist - a1.r);
        let eef = IonIonForce(-a1.electrons*E_CHARGE, -a2.electrons*E_CHARGE, dist - a1.r - a2.r);
        
        let f = ppf + pef + epf + eef;
        
        xf -= f * dx/dist;
        yf -= f * dy/dist;
       
        let relpos = this.relpos[i];
        let relangle = atan2(relpos[1], relpos[0]);
        let mag = sqrt(relpos[0]*relpos[0] + relpos[1]*relpos[1]);
              
       af += sin(PI/2 - relangle + this.angle)* mag*f*dy/dist - cos(PI/2 - relangle + this.angle) * mag*f*dx/dist;
       
         
      });
    });
    

    this.xa += xf/this.mass/SPEED;
    this.ya += yf/this.mass/SPEED;
    
    let dampf = DAMP * this.av;
    this.aa += (af - dampf)/(this.mass*this.r)/SPEED;
    
    //console.log(xf + " " + yf + " " + af);
  }
  
  
  update() {
    if (mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.r) {
      if (currentMol != this) {
        currentMol = this;
      } else {
        this.x = mouseX;
        this.y = mouseY;
        this.xv = 0;
        this.yv = 0;
      }      
    } 
    
    this.x += this.xv;
    this.y += this.yv;
    
    this.xv += this.xa;
    this.yv += this.ya;
    
    if (sqrt(this.xv*this.xv + this.yv*this.yv) > MAX_VEL) {
      this.xv = MAX_VEL * this.xv/sqrt(this.xv*this.xv + this.yv*this.yv);
      this.yv = MAX_VEL * this.yv/sqrt(this.xv*this.xv + this.yv*this.yv);
    }
    
    if ((this.x > width && this.xv > 0)|| (this.x < 0 && this.xv < 0)) {
      this.xv = 0;
      this.xa = 0;
    } 
    
    if ((this.y > height && this.yv > 0) || (this.y < 0 && this.yv < 0)) {
      this.yv = 0;
      this.ya = 0;
    } 
    
    this.angle += this.av;
    this.av += this.aa;
    
    this.atoms.forEach((a, index, array) => {
      let relpos = this.relpos[index];
      let relangle = atan2(relpos[1], relpos[0]);
      let mag = sqrt(relpos[0]*relpos[0] + relpos[1]*relpos[1]);
    a.update(this.x + sin(PI/2 - relangle + this.angle) * mag, this.y + cos(PI/2 - relangle + this.angle) * mag);
    });
    
    this.xa = 0;
    this.ya = 0;
    this.aa = 0;
  }
  
}


function setup() {
  createCanvas(400, 400);
  
  for (let i = 0; i < molecules.length; i++) {
    molecules[i] = new Molecule(i, (i+1)*width/(molecules.length+1),random(0, height),random(0, PI));
    
  let a1 = new Atom(5, 0.1, 0, 1);
  let a2 = new Atom(10, 0.6, 2, 0);
  let a3 = new Atom(5, 0.1, 0, 1);
    
  molecules[i].addAtom(a1,-12, -8);
   molecules[i].addAtom(a2,0, 0);
   molecules[i].addAtom(a3,12,-8)
  }

}

function draw() {
  background(220);
  
  molecules.forEach((m) => m.show());
  
  for (let i = 0; i<molecules.length; i++) {
    for (let j = i + 1; j < molecules.length; j++) {
      molecules[i].calculateForceCouple(molecules[j]);
      molecules[j].calculateForceCouple(molecules[i]);
    }
  }
  
  for (let i = 0; i<molecules.length; i++) {
    for (let j = i + 1; j < molecules.length; j++) {
      molecules[i].checkCollision(molecules[j]);
    }
  }
  
  molecules.forEach((m) => m.update());
}