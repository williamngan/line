class InnerLine extends SmoothSpeedBrush {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = {
      dark: "#ff2d5d",
      dark2: "rgba(255,45,93, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  draw( f=this.form ) {

    // connect polygons
    f.stroke( this.getColor() ).fill( false );
    f.innerLine( this.points, 20, 1, 7 );
  }

  up() {

  }

}