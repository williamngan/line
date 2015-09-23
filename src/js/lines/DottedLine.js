class DottedLine extends BaseLine {

  constructor(...args) {
    super( ...args );
  }


  animate( time, fps, context) {
    this.form.fill( "rgba(0,0,0,.3" ).stroke(false);
    this.form.dottedLine( this.points );
  }

}