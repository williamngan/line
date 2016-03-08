// Optimizing some brushes' settings for painting

class GrowLineBrush extends GrowLine {

  draw( f=this.form ) {
    if (!this.shouldDraw()) return;
    f.stroke( this.getColor() ).fill( false );
    f.growLine( this.points, this.lastPoints, 7 );
  }
}


class JaggedLineBrush extends JaggedLine {

  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() );
    f.jaggedLine( this.points, this.lastPoints, 10, 4 );
  }

}

class InnerLineBrush extends WiggleLine {
  draw( f=this.form ) {

    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() ).fill( false );
    f.innerLine( this.points, 20, 2, 7, 0, 2 );
  }
}

class DottedLineBrush extends DottedLine {
  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    f.fill( this.getColor() ).stroke(false);
    f.dottedLine( this.points, 3, 1, 0.5 );
  }
}

class ZigZagLineBrush extends ZigZagLine {
  draw( f = this.form ) {
    if (!this.shouldDraw() || Math.random()<0.5) return;

    this.maxTracePoints = 1 + Math.floor( Math.random()* 8 );

    let swidth = (this.tracing) ? 1 : 2;
    f.stroke( this.getColor(), swidth ).fill( false );
    f.zigZagLine( this.points, Math.random()/3, this.maxDistance(10) );

  }
}

class NoiseBrushTwo extends NoiseBrush {
  constructor(...args) {
    super( ...args );
    this.seedIndex = Math.floor( Math.random() * this.seeds.length );
    this.noise.seed( this.seeds[this.seedIndex] );
  }

}

class NoiseDashLineBrush extends NoiseDashLine {
  constructor(...args) {
    super( ...args );
    this.seedIndex = Math.floor( Math.random() * this.seeds.length );
    this.noise.seed( this.seeds[this.seedIndex] );
  }

  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    f.fill( false ).stroke( this.getColor() );

    let distRatio = Math.random() + 1;
    let smooth = 3;
    let layers = 10;
    let magnify = 1.5;
    let curveSegments = 1;
    let flatness = 0.87;

    this.noiseProgress += 0.001;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noiseDashLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments, flatness);
  }
}

class NoiseChopLineBrush extends NoiseChopLine {
  constructor(...args) {
    super( ...args );
    this.seedIndex = Math.floor( Math.random() * this.seeds.length );
    this.noise.seed( this.seeds[this.seedIndex] );
  }

  draw( f=this.form ) {

    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() );

    let distRatio = Math.random()/3 + 1;
    let smooth = 4;
    let layers = 5;
    let magnify = 1.2;
    let curveSegments = 3;

    this.noiseProgress -= 0.008;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noiseChopLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);

  }
}



class SmoothNoiseLineBrush extends SmoothNoiseLine {

  constructor(...args) {
    super( ...args );
    this.seedIndex = Math.floor( Math.random() * this.seeds.length );
    this.noise.seed( this.seeds[this.seedIndex] );
  }

  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    let strokeWidth = (this.tracing) ? 0.5 : 1;
    f.stroke( this.getColor(), strokeWidth ).fill( this.getColor("color2") );

    let distRatio = 2.5;
    let smooth = 5;
    let layers = Math.floor(Math.random()*3)+3;
    let magnify = 1;
    let curveSegments = 3;

    this.noiseProgress += 0.001;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noisePolygon( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
  }
}



// Main app
(function() {

  var space = new CanvasSpace("playCanvas", false ).display("#playground");
  var line = new BaseLine().init( space );
  space.refresh( false );
  space.clear("rgb(250,252,255)");

  var currentBrush = "RestatedLine";
  var lastBrush = document.querySelector("#initialBrush");
  var lastBrushColor = document.querySelector("#initialBrushColor");
  var brushColor = "dark";


  var brushes = document.querySelectorAll(".brush");
  for (let i=0; i<brushes.length; i++) {
    ["mouseup", "touchend"].forEach( function(e) {
      brushes[i].addEventListener( e, function ( evt ) {
        if (lastBrush) lastBrush.className = "brush";
        currentBrush = evt.currentTarget.getAttribute( "data-id" ) || currentBrush;
        evt.currentTarget.className = "brush selected";
        lastBrush = evt.currentTarget;

        evt.stopPropagation();
      } )
    });
  }

  var brushcolors = document.querySelectorAll(".brushcolor");
  for (let i=0; i<brushcolors.length; i++) {
    ["mouseup", "touchend"].forEach( function(e) {
      brushcolors[i].addEventListener( e, function ( evt ) {
        if (lastBrushColor) lastBrushColor.className = "brushcolor";
        brushColor = evt.currentTarget.getAttribute( "data-id" ) || brushColor;
        evt.currentTarget.className = "brushcolor selected";
        updateTo( false );
        lastBrushColor = evt.currentTarget;

        evt.stopPropagation();
      } );
    });
  }

  document.querySelector("#pager").addEventListener("click", function(evt) {
    var curr = evt.target.className;
    if (curr == "black") {
      evt.target.className="white";
      space.clear("rgb(30,35,42)");
    } else {
      evt.target.className="black";
      space.clear("rgb(237,240,242)");
    }
  });


  document.querySelector("#menu").addEventListener( "mouseenter", function() {
    penUp();
  });


  function penDown(evt) {
    updateTo( window[currentBrush] );
    line.trace( true );
  }


  function penUp(evt) {
    line.points = [];
    line.trace( false );
    space.remove(line);
  }


  space.add( {
    animate: function() {
      // app specific animation here
    },

    onMouseAction: function(type, x, y) {
      if (type == "down") {
        penDown();
      } else if (type == "up") {
        penUp();
      }

    },

    onTouchAction: function(type, x, y) {
      if (type == "down") {
        penDown();
      } else if (type == "up") {
        penUp();
      }
    }

  });

  //space.bindCanvas( "mousedown", penDown );
  //space.bindCanvas( "touchstart", penDown );
  //
  //space.bindCanvas( "mouseup", penUp );
  //space.bindCanvas( "mouseleave", penUp );
  //space.bindCanvas( "mouseout", penUp );
  //space.bindCanvas( "touchend", penUp );

  space.bindMouse();
  space.bindTouch();
  space.play();
  space.stop(100000);



  /**
   * Load Line class
   * @param LineClass
   */
  function updateTo( LineClass ) {

    var shouldAddLine = true;
    if (!LineClass) {
      LineClass = window[currentBrush];
      shouldAddLine = false;
    }

    var _temp = line.points.slice();
    space.remove( line );
    line = new LineClass().init( space );

    // Very rough color picker logic
    if (brushColor === "dark") {
      line.setColor(
          {
            dark: "rgba(0,0,0,.08)",
            dark2: "rgba(0,0,0,.02)",
            light: "rgba(0,0,0,.02)",
            ligh2: "rgba(0,0,0,.02)"
          },
          {
            dark: "rgba(0,0,0,.01)",
            dark2: "rgba(0,0,0,.01)",
            light: "rgba(0,0,0,.01)",
            ligh2: "rgba(0,0,0,.01)"
          }
      );
      if (LineClass === InnerLineBrush) {
        line.setColor( {
          dark: "rgba(0,0,0,.01)",
          dark2: "rgba(0,0,0,.01)",
          light: "rgba(0,0,0,.01)",
          ligh2: "rgba(90,90,90,.01)"
        } )
      }
      if (LineClass === ZigZagLineBrush) {
        line.setColor( {
          dark: "rgba(0,0,0,.3)",
          dark2: "rgba(0,0,0,.3)",
          light: "rgba(0,0,0,.1)",
          ligh2: "rgba(0,0,0,.1)"
        } )
      }
    } else {
      line.setColor(
        {
          dark: "rgba(255,255,255,.05)",
          dark2: "rgba(255,255,255,.05)",
          light: "rgba(255,255,255,.05)",
          ligh2: "rgba(255,255,255,.05)"
        },
        {
          dark: "rgba(255,255,255,.02)",
          dark2: "rgba(255,255,255,.02)",
          light: "rgba(255,255,255,.02)",
          ligh2: "rgba(255,255,255,.02)"
        }
      );
      if (LineClass === InnerLineBrush) {
        line.setColor( {
          dark: "rgba(255,255,255,.05)",
          dark2: "rgba(255,255,255,.05)",
          light: "rgba(255,255,255,.05)",
          ligh2: "rgba(90,90,90,.05)"
        } )
      }
      if (LineClass === ZigZagLineBrush) {
        line.setColor( {
          dark: "rgba(255,255,255,.3)",
          dark2: "rgba(255,255,255,.3)",
          light: "rgba(255,255,255,.1)",
          ligh2: "rgba(255,255,255,.1)"
        } )
      }
      if (LineClass === SmoothNoiseLineBrush) {
        console.log("!!");
        line.setColor( {
          dark: "rgba(255,255,255,.01)",
          dark2: "rgba(255,255,255,.01)",
          light: "rgba(255,255,255,.01)",
          ligh2: "rgba(255,255,255,.01)"
        } )
      }
    }


    line.points = _temp;
    line.maxPoints = 30;
    line.maxTracePoints = 30;
    line.pointThreshold = Math.max( line.pointThreshold, 50 );

    if (shouldAddLine) space.add( line );
  }



  // UI
  window.menuToggle = function() {
  	document.querySelector("#menu").classList.toggle("open");
  	document.querySelector("#playground").classList.toggle("larger");
  	document.querySelector("#close").classList.toggle("closed");
  }


})();



