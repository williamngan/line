class SpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this.lastDist = 1;
    this.lastSegments = {a: false, b: false};
    this.flipSpeed = false;

    this.maxPoints = 100;
  }


  drawSegments( last, curr, index) {

    if (last && curr) {

      let dist = curr.distance( last ) / this.speedRatio;
      dist = (this.flipSpeed) ? 10 - Math.min(10, dist) : dist;
      dist = (this.lastDist + dist) / 2;
      this.lastDist = dist;

      var ln = new Line(last).to(curr);
      var a = ln.getPerpendicular( 0.5, dist );
      var b = ln.getPerpendicular( 0.5, dist, true );

      this.drawSpeed( index, dist, ln, a, b );
    }
  }


  drawSpeed( index, dist, line, seg1, seg2 ) {

    if (index > 1) {

      if (!this.flipSpeed) {
        this.form.stroke( "rgba(0,0,0,.2)" );
        this.form.line( line );
        this.form.stroke( "rgba(0,0,0,.2)" ).fill( "rgba(0,0,0,.6)" );
      } else {
        this.form.stroke( "#222" ).fill("#222");
      }

      this.form.polygon( [this.lastSegments.a, this.lastSegments.b, seg2.p1, seg1.p1] );
    }
    //this.form.line( seg1 );
    //this.form.line( seg2 )

    this.lastSegments = { a: seg1.p1.clone(), b: seg2.p1.clone() };
  }


  up(x, y) {
    this.flipSpeed = !this.flipSpeed;
  }
}