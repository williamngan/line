class DottedLine extends BaseLine {

  constructor(...args) {
    super( ...args );
  }


  draw( f=this.form ) {
    f.fill( "rgba(0,0,0,.3" ).stroke(false);
    f.dottedLine( this.points );
  }
}