class RestatedLine extends SpeedLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 150;
    this.pointThreshold = 7*7;

    this.color = this.colors.black(0.6);
    this.color2 = this.colors.black(0.35);
  }

  draw( f=this.form ) {

    f.stroke( this.getColor() ).fill(false);
    f.curve( this.catmullRom(5), false );

    f.stroke( this.getColor("color2") ).fill(false);
    f.restatedLine( this.points, 10, 0.2, 0.2 );

  }

}

