class GrowLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 500;
    this.color = this.colors.black();
    this.color.dark2 = "rgba(0,10,15,.1)";
    this.lastPoints = [];
  }


  draw( f=this.form ) {
    f.stroke( this.getColor() ).fill( false );
    f.growLine( this.points, this.lastPoints );
  }

}

