class SmoothSpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
  }

  animate( time, fps, context) {

    // draw regular path
    this.form.stroke("rgba(0,0,0,.2)").fill(false);
    this.form.polygon( this.points, false );

    // connect polygons
    this.form.stroke( "rgba(0,0,0,.2)" ).fill( "rgba(0,0,0,.6)" );
    this.form.speedPolygon( this.points, this.flipSpeed, 0.5, 5);
  }

  up(x, y) {
    this.flipSpeed = (this.flipSpeed > 0) ? 0 : 10;
  }
}