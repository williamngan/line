class SmoothSpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
  }

  draw( f=this.form ) {

    // draw regular path
    f.stroke("rgba(0,0,0,.2)").fill(false);
    f.polygon( this.points, false );

    // connect polygons
    f.stroke( "rgba(0,0,0,.2)" ).fill( "rgba(0,0,0,.6)" );
    f.speedPolygon( this.points, this.flipSpeed, 0.5, 5, this.maxDistance());
  }

  up(x, y) {
    this.flipSpeed = (this.flipSpeed > 0) ? 0 : 10;
  }
}