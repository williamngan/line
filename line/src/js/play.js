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
    f.stroke( "rgba(0,0,0,.3)", swidth ).fill( false );
    f.zigZagLine( this.points, Math.random()/3, this.maxDistance(10) );

  }
}


class SmoothNoiseLineBrush extends SmoothNoiseLine {

  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    let strokeWidth = (this.tracing) ? 0.5 : 1;
    f.stroke( this.getColor(), strokeWidth ).fill( this.getColor("color2") );

    let distRatio = 2.5;
    let smooth = 5;
    let layers = Math.floor(Math.random()*3)+3;
    let magnify = 1;
    let curveSegments = 3;

    this.noiseProgress += 0.003;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noisePolygon( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
  }
}

(function() {


  var space = new CanvasSpace("playCanvas", false ).display("#playground");
  var buffer = new CanvasSpace("bufferCanvas", false ).display("#buffer");
  var line = new NoiseDashLine().init( space );

  space.refresh( false );

  var currentBrush = "SmoothNoiseLineBrush";

  var brushes = document.querySelectorAll(".brush");
  for (var i=0; i<brushes.length; i++) {
    brushes[i].addEventListener("click", function(evt) {
      currentBrush = evt.target.getAttribute("data-id") || currentBrush;
    })
  }


  function penDown(evt) {

    updateTo( window[currentBrush] );
    line.trace( true );

  }

  function penUp(evt) {
    //buffer.ctx.drawImage( space.space, 0, 0);

    line.points = [];
    line.trace( false );
    space.remove(line);
    //space.refresh( true );

  }


  space.bindCanvas( "mousedown", penDown );
  space.bindCanvas( "touchstart", penDown );

  space.bindCanvas( "mouseup", penUp );
  space.bindCanvas( "mouseleave", penUp );
  space.bindCanvas( "mouseout", penUp );
  space.bindCanvas( "touchend", penUp );

  space.bindMouse();
  space.play();
  space.stop(100000);


  /**
   * Load Line class
   * @param LineClass
   */
  function updateTo( LineClass ) {

    var _temp = line.clone();
    space.remove( line );
    line = new LineClass().init( space );
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
      line.setColor({
        dark: "rgba(0,0,0,.01)",
        dark2: "rgba(0,0,0,.01)",
        light: "rgba(0,0,0,.01)",
        ligh2: "rgba(90,90,90,.01)"
      })
    }


    line.points = _temp.points;
    line.maxPoints = 20;

    line.down = function(x, y) {
      this.points = [];
      this.to(x, y);
    };

    space.add( line );
  }



})();