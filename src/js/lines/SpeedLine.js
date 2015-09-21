class SpeedLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 5;
    this.speedRatio = 2;
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


  animate( time, fps, context) {
    //this.form.stroke("rgba(0,0,0,.4)");
    //this.form.curve( this.catmullRom(5) );
    this.drawLine();
  }


  trim() {
    if (this.points.length > this.maxPoints ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }


  move(x, y, z) {
    this.to(x, y);
    this.trim();
    if (this.pressed) this.drag(x, y);
  }


  drag(x, y) {}


  down(x, y) {}


  up(x, y) {}


}

