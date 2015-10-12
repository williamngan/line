class ZigZagLine extends SpeedLine {

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


  maxDistance(ratio=20) {
    return Math.min(this.canvasSize.x, this.canvasSize.y)/ratio;
  }


  draw( f=this.form ) {

    let c =  this.getColor();
    // draw regular path
    //f.polygon( this.points, false );
    f.stroke(false).fill( c );
    f.points( this.points, 1);
    f.stroke( c ).fill(false);
    f.zigZagLine( this.points, 0.5, this.maxDistance() );

    //this.form.curve( this.catmullRom(5) );
    //this.drawLine();
  }



}

