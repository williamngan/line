class DottedLine extends BaseLine {

  constructor(...args) {
    super( ...args );

    this.pointThreshold = 50;

    this.color = {
      dark: "#42dc8e",
      dark2: "rgba(66,220,142, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }


  draw( f=this.form ) {
    f.fill( this.getColor() ).stroke(false);
    f.dottedLine( this.points, 3, 3, 0.5 );
  }
}