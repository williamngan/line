class ZigZagLine extends SpeedLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 300;

    this.pointThreshold = 30;

    this.color = this.colors.black();
    this.color.dark2 = this.colors.black(.4).dark;
    this.color2 = this.colors.grey(.3);
    //this.color2.dark2 = "rgba(0,0,0,0)";
  }

  distances() {
    var last = null;
    this.points.map( ( p ) => {
      if (!last) return 0;
      let dist = p.distance( last );
      last = p.clone();
      return dist;
    } );
  }


  maxDistance( ratio = 20 ) {
    return Math.min( this.canvasSize.x, this.canvasSize.y ) / ratio;
  }


  draw( f = this.form ) {

    this.maxTracePoints = 2 + Math.floor( Math.random()* 3 );

    f.stroke( false ).fill( this.getColor( "color2" ) ).points( this.points, 1 );
    f.stroke( this.getColor( "color2" ), 1 ).fill( false ).polygon( this.points, false );

    let swidth = (this.tracing) ? 1 : 2;
    f.stroke( this.getColor(), swidth ).fill( false );
    f.zigZagLine( this.points, 0.5, this.maxDistance() );

  }

}

