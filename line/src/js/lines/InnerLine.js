class InnerLine extends SmoothSpeedBrush {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
  }

  draw( f=this.form ) {

    // connect polygons
    f.stroke( "rgba(0,0,0,1)" ).fill( false );
    f.innerLine( this.points, 10, 1 );
  }

}