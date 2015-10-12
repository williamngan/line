class SmoothSpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this._flip = 0;
    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = {
      dark: "#374a58",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(0,0,0,.5)",
      dark2: "rgba(0,0,0, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  draw( f=this.form ) {


    // connect polygons
    f.stroke( false ).fill( this.getColor() );
    f.speedPolygon( this.points, 0, 0.5, 7, this.maxDistance());

      // draw regular path
    f.stroke( this.getColor("color2")).fill(false);
    f.polygon( this.points, false );
  }

  up(x, y) {
    //if (++this._flip % 2 === 0) {
    //  this.flipSpeed = (this.flipSpeed > 0) ? 0 : 15;
    //}
  }
}