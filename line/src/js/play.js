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

class InnerLineBrush extends InnerLine {
  draw( f=this.form ) {

    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() ).fill( false );
    f.innerLine( this.points, 20, 2, 7 );
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

    this.noiseProgress += 0.001;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noiseDashLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
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

  var currentBrush = "BaseLine";
  var brushColor = "dark";


  var brushes = document.querySelectorAll(".brush");
  for (let i=0; i<brushes.length; i++) {
    ["click", "touchend"].forEach( function(evt) {
      brushes[i].addEventListener( evt, function ( evt ) {
        currentBrush = evt.target.getAttribute( "data-id" ) || currentBrush;
        evt.target.className = "brush selected";
        console.log( "@@@" );
      } )
    });
  }

  var brushcolors = document.querySelectorAll(".brushcolor");
  for (let i=0; i<brushcolors.length; i++) {
    ["click", "touchend"].forEach( function(evt) {
      brushcolors[i].addEventListener( evt, function ( evt ) {
        brushColor = evt.target.getAttribute( "data-id" ) || brushColor;
      } )
    });
  }

  var bgcolor = document.querySelectorAll(".bgcolor");
  for (let i=0; i<bgcolor.length; i++) {
    ["click", "touchend"].forEach( function(evt) {
      bgcolor[i].addEventListener( evt, function ( evt ) {
        let bg = evt.target.getAttribute( "data-id" ) || "white";

        if (bg === "black") {
          space.clear( "#000" );
        } else if (bg === "grey") {
          space.clear( "#bbb" );
        } else {
          space.clear( "#fff" );
        }
      } )
    });
  }

  function penDown(evt) {
    console.log("###");

    updateTo( window[currentBrush] );
    line.trace( true );
  }

  function penUp(evt) {
    console.log("!!!");
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
          dark: "rgba(255,255,255,.08)",
          dark2: "rgba(255,255,255,.02)",
          light: "rgba(255,255,255,.02)",
          ligh2: "rgba(255,255,255,.02)"
        },
        {
          dark: "rgba(255,255,255,.01)",
          dark2: "rgba(255,255,255,.01)",
          light: "rgba(255,255,255,.01)",
          ligh2: "rgba(255,255,255,.01)"
        }
      );
      if (LineClass === InnerLineBrush) {
        line.setColor( {
          dark: "rgba(255,255,255,.01)",
          dark2: "rgba(255,255,255,.01)",
          light: "rgba(255,255,255,.01)",
          ligh2: "rgba(90,90,90,.01)"
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
    }


    line.points = _temp;
    line.maxPoints = 20;


    space.add( line );
  }


})();
