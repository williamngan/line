class WiggleLine extends InnerLine {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
    this.angle = 0;


    this.color = this.colors.black();
  }

  draw( f=this.form ) {

    this.angle += Const.one_degree;
    let density = (this.tracing) ? 6 : 30;

    // connect polygons
    f.stroke( this.getColor() ).fill( false );
    f.innerWiggleLine( this.points, density, 70, {angle: this.angle, step: Const.one_degree*5 }, 1.5, 2 );
  }

}