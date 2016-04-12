class DottedLine extends BaseLine {

  constructor(...args) {
    super( ...args );

    this.pointThreshold = 50;

    this.color = this.colors.black();
  }


  draw( f=this.form ) {
    if (!this.shouldDraw()) return;

    f.fill( this.getColor() ).stroke(false);
    f.dottedLine( this.points, 3, 3, 0.5 );
  }
}