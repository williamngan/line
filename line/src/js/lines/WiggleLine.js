class WiggleLine extends InnerLine {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
    this.angle = 0;

    this.color = {
      dark: "rgba(0,0,0,0.3)",
      dark2: "rgba(0,0,0, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  draw( f=this.form ) {

    this.angle += Const.one_degree;

    // connect polygons
    f.stroke( this.getColor() ).fill( false );
    f.innerWiggleLine( this.points, 20, 70, {angle: this.angle, step: Const.one_degree*5 }, 1.5, 2 );
  }

}