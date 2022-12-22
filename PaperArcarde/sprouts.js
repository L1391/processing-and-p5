//https://apoorvaj.io/cubic-bezier-through-four-points/

let sproutsGame = new p5((s) => {

  let GameState = "lineDrawing";

  const POINT_FREQ = 10;

  let sproutPoints = [];
  let totalPoints = [];
  let totalControls = []

  let points = [];
  let controls = [];
  let count = 0;

  let selectedPoint;

  let newpointx = 0;
  let newpointy = 0;

  let roundNumber = 0;
  
  s.setup = () => {
    s.createCanvas(400, 400);  
    s.resetGame();
  }

   s.draw= () => {
    s.background(255);
    s.stroke(0);

    for (let i = 0; i<totalPoints.length; i++) {
      let sectionLength = totalPoints[i].length;

      for (let j = 1; j<sectionLength-2; j++) {

            s.bezier(totalPoints[i][j].x,totalPoints[i][j].y,totalControls[i][2*(j-1)].x, totalControls[i][2*(j-1)].y, totalControls[i][2*(j-1)+1].x, totalControls[i][2*(j-1)+1].y, totalPoints[i][j+1].x, totalPoints[i][j+1].y);

      }
    }

    sproutPoints.forEach((sproutPoint) => {
      s.circle(sproutPoint.x, sproutPoint.y, 5);
    })

    if (GameState == "newPointCreation") {

      let mousePos = s.mouseX;

      if (mousePos >= s.width) mousePos = s.width-1;
      if (mousePos <= 0) mousePos = 1;

      let mouseNormalized = mousePos/s.width*(points.length-3);
      let segment = s.floor(mouseNormalized);

      newpointx = s.bezierPoint(points[segment+1].x,controls[2*segment].x,controls[2*segment + 1].x, points[segment+2].x,mouseNormalized-segment);
      newpointy = s.bezierPoint(points[segment+1].y,controls[2*segment].y,controls[2*segment + 1].y, points[segment+2].y,mouseNormalized-segment);

      s.circle(newpointx,newpointy,2)
    } else if (GameState == "pointSelection") {
      let currentCheck = false;

      sproutPoints.forEach((sproutPoint) => {
        if (s.dist(s.mouseX, s.mouseY, sproutPoint.x, sproutPoint.y) < 10) {
          currentCheck = true;
          selectedPoint = sproutPoint;
          s.stroke(255,0,0);
          s.circle(sproutPoint.x, sproutPoint.y, 5);
        }
      });

      if (!currentCheck) selectedPoint = null;

    } else if (GameState == "lineDrawing") {

      let currentCheck = false;

      sproutPoints.forEach((sproutPoint) => {
        if (s.dist(s.mouseX, s.mouseY, sproutPoint.x, sproutPoint.y) < 10) {
          currentCheck = true;
          selectedPoint = sproutPoint;
          s.stroke(255,0,0);
          s.circle(sproutPoint.x, sproutPoint.y, 5);
        }
      });

      if (!currentCheck) selectedPoint = null;

    }
  }

   s.mouseDragged = () => {
    if (GameState == "lineDrawing") {
      count++;

      if (count % POINT_FREQ == 0) {
          points.push(s.createVector(s.mouseX,s.mouseY));
      }
    }

  }

  s.mouseReleased = () => {

    if (GameState == "lineDrawing") {
       if (points.length >= 4) {
          s.noFill();

         if (roundNumber == 0) {
                       sproutPoints.push(points[0],points[points.length-1]);

         } else {
           if (!selectedPoint) {
             alert("Invalid ending point. The new curve must end at a seed (will highlight in red).");
             points = [];
             controls = [];
             count = 0;

             GameState = "pointSelection";
             return;
           } else {
             points.push(selectedPoint);
           }
         }

          s.circle(points[0].x,points[0].y,5);
          s.circle(points[points.length-1].x,points[points.length-1].y,5);

          let p00 = p5.Vector.sub(points[0],points[1]);
          p00.mult(0.001);
          p00.add(points[0]);

          let t00 = getTangents(p00, points[0], points[1], points[2]);


          controls.push(t00[0],t00[1]);

          for (let i = 1; i<points.length-2; i++) {

            var t = getTangents(points[i-1], points[i], points[i+1], points[i+2]);

            controls.push(t[0],t[1]);

            s.bezier(points[i].x,points[i].y,t[0].x, t[0].y, t[1].x, t[1].y, points[i+1].x, points[i+1].y);


          }



        let pnn = p5.Vector.sub(points[points.length-1],points[points.length-2]);
        pnn.mult(0.001);
        pnn.add(points[points.length-1]);

        let tnn = getTangents(points[points.length-3],points[points.length-2],points[points.length-1],pnn)


      points.unshift(p00);
      points.push(pnn);
      controls.push(tnn[0],tnn[1]);

      count = 0;

      totalPoints.push(points);
      totalControls.push(controls);

      GameState = "newPointCreation";

      } else {
        alert("Drawn too fast, curve could not be determined. Please draw slower.");
        points = [];
        count = 0;

      }
    } else if (GameState == "newPointCreation") {
      let newSprout = s.createVector(newpointx, newpointy);
      sproutPoints.push(newSprout);

      points = [];
      controls = [];
      roundNumber++;
      GameState = "pointSelection";

    }

  }

  s.mousePressed = () => {
    if (s.mouseX< s.width && s.mouseY< s.height) {
      if (GameState == "pointSelection") {
      if (selectedPoint) {
        points.push(selectedPoint);
        GameState = "lineDrawing";
      } else {
        alert("Invalid starting point. The new curve must start at a seed (will highlight in red).");
      }

    }
    }
  }
  
  s.resetGame = () => {
    GameState = "lineDrawing";

     sproutPoints = [];
     totalPoints = [];
     totalControls = []

     points = [];
     controls = [];
     count = 0;

    selectedPoint = null;

    roundNumber = 0;
  }


  function getTangents(p0,p1,p2,p3) {
    var d1 = s.sqrt(p5.Vector.sub(p1,p0).mag());
          var d2 = s.sqrt(p5.Vector.sub(p2,p1).mag());
          var d3 = s.sqrt(p5.Vector.sub(p3,p2).mag());

          var quotient1 = 3*d1*(d1+d2);
          var quotient2 = 3*d3*(d3+d2);

          var numerator1 = 2*d1*d1 + 3*d1*d2 + d2*d2;
          var numerator2 = 2*d3*d3 + 3*d3*d2 + d2*d2;
          var t1 = p5.Vector.mult(p2, d1*d1);
          t1.sub(p5.Vector.mult(p0, d2*d2));
          t1.add(p5.Vector.mult(p1,numerator1));
          t1.div(quotient1);

          var t2 = p5.Vector.mult(p1, d3*d3);
          t2.sub(p5.Vector.mult(p3, d2*d2));
          t2.add(p5.Vector.mult(p2,numerator2));
          t2.div(quotient2);

          return [t1, t2];
  }
}, document.getElementById('sprouts'));
