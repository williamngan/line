class WiggleLine extends InnerLine {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
    this.angle = 0;
  }

  draw( f=this.form ) {

    this.angle += Const.one_degree*1;

    // connect polygons
    f.stroke( "rgba(0,0,0,0.3)" ).fill( false );
    f.innerWiggleLine( this.points, 20, 70, {angle: this.angle, step: Const.one_degree*5 }, 1.5, 2 );
  }

}