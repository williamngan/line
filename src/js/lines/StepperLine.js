class StepperLine extends NoiseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 50;
    this.splitLines = [];

  }

  onSpaceResize(w, h, evt) {

    this.splitLines = [];
    var dw = w/9;
    for (var i=0; i<8; i++) {
      this.splitLines.push( new BaseLine().to( dw + dw*i, h/2 ) );
    }
  }

  /**
   * Move the split lines
   * @param pts
   * @private
   */
  _continuous( sp, pts, offset=5 ) {

    var ps = [];
    var pa = pts.slice(1, offset);
    var pb = pts.slice(offset);

    // double
    if (pb.length > 1 && pa.length>1) {

      var ang = pb[pb.length - 1].angle( pb[pb.length - 2] );
      var ang2 = pa[1].angle( pa[0] );

      pb = pb.map( ( p ) => p.$subtract( pb[0] ).add( sp.getAt( 0 ) ) );
      pa = pa.map( ( p, i ) => p.$subtract( pa[0] ).rotate2D( ang - ang2 ).add( pb[pb.length - 1] ) );
      ps = pb.concat( pa );

    // single
    } else if (pa.length<2) {
      ps = pb.map( ( p ) => p.$subtract( pb[0] ).add( sp.getAt( 0 ) ) );

    } else if (pb.length <2) {
      ps = pa.map( ( p ) => p.$subtract( pa[0] ).add( sp.getAt( 0 ) ) );
    }

    for (var i = 0; i < ps.length; i++) {
      sp.setAt( i + 1, ps[i] );
    }
  }


  /**
   * Trim and create new split line
   */
  trim() {
    if (this.points.length > this.maxPoints ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }


  draw( f=this.form ) {
    super.draw(f);

    var pts = this.$op( "subtract", this.$getAt(0) ).toArray();

    // track split lines
    this.splitLines.map( (sp, i) => {
      sp.draw( f );
      this._continuous( sp, pts, Math.floor(i* pts.length/this.splitLines.length) );
    });

  }
}

