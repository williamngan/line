class SpeedLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 150;
  }

  distances() {
    var last = null;
    this.points.map( (p) => {
      if (!last) return 0;
      let dist = p.distance(last);
      last = p.clone();
      return dist;
    });
  }

  /*
  drawSegments( last, curr, index) {

    if (last && curr) {

      let dist = curr.distance( last ) / this.speedRatio;

      var ln = new Line(last).to(curr);
      var a = ln.getPerpendicular( 0.5, dist );
      var b = ln.getPerpendicular( 0.5, dist, true );

      this.drawSpeed( index, dist, ln, a, b );
    }
  }


  drawSpeed( index, dist, line, seg1, seg2 ) {
    this.form.stroke("rgba(0,0,0,.4)").fill(false);
    this.form.point( this.points[index], 0.5);
    this.form.line( line );
    this.form.line( seg1 );
    this.form.line( seg2 )
  }

  drawLine() {

    var last = null;
    var count = 0;
    for (var p of this.points) {
      let vec = new Vector( p );
      this.drawSegments( last, vec, count++ );
      last = vec.clone();
    }

  }
  */

  maxDistance(ratio=20) {
    return Math.min(this.canvasSize.x, this.canvasSize.y)/ratio;
  }

  draw( f=this.form ) {
    f.stroke("rgba(0,0,0,.4)").fill(false);
    // draw regular path
    f.polygon( this.points, false );
    f.speedLine( this.points, 0.5, this.maxDistance() );

    //this.form.curve( this.catmullRom(5) );
    //this.drawLine();
  }



}

