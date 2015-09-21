class DottedLine extends BaseLine {

  constructor(...args) {
    super( ...args );
  }

  drawLine() {

    form.fill( "rgba(0,0,0,.3" ).stroke(false);
    form.points( this.points, 2, true );

    var last = this.points[0];
    var count = 0;
    for (var p of this.points) {
      let ln = new Line( p ).to( last );

      let pts = ln.subpoints(5);


      form.points( pts, 0.5 );

      last = new Vector(ln);
    }

  }


  animate( time, fps, context) {
    this.drawLine();
  }

}