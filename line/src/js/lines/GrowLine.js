class GrowLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 500;

    this.color = {
      dark: "#65739a",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "#95b1f9",
      dark2: "rgba(149,177,249, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.ang = 0;

    this.lastPoints = [];
  }

  trim() {
    var m = (this.tracing) ? this.maxTracePoints : this.maxPoints;
    if (this.points.length > m ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }

  draw( f=this.form ) {

    f.stroke( this.getColor() ).fill( false );
    f.growLine( this.points, this.lastPoints );
  }


}

