class JaggedLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 100;

    this.color = this.colors.black(.3);
    this.color.dark2 = "rgba(0,0,0,0)";

    this.color2 = this.colors.grey(1);

    this.lastPoints = [];
  }


  draw( f=this.form ) {

    f.stroke( this.getColor() ).fill( false );
    f.polygon( this.points, false );

    f.stroke( this.getColor("color2") );
    f.jaggedLine( this.points, this.lastPoints );
  }


}

