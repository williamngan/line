class HatchingLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 150;

    this.pointThreshold = 20;

    this.color = this.colors.black(0.7);
    this.color.dark2 = this.colors.black(0.15).dark;
  }


  draw( f=this.form ) {

    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() ).fill(false);
    f.hatchingLine( this.points );

  }

}

