class ContinuousLine extends NoiseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 30;
    this.bounds = null;
    this.splitLines = [];
  }

  onSpaceResize(w, h, evt) {
    this.bounds = new Rectangle(0,0).to(w, h);
  }

  /**
   * Move the split lines
   * @param pts
   * @private
   */
  _continuous( pts ) {
    var d1 = pts.$getAt(1).$subtract( pts.getAt(0) );
    pts.disconnect(0);
    pts.to( pts.$getAt( pts.points.length-1 ).$add( d1 ) );
  }

  /**
   * Check if the split line is out of bound
   * @param pts
   * @private
   */
  _checkBounds( pts ) {
    if (!this.bounds || pts.points.length === 0) return;

    var count = -1;
    for (var i=pts.points.length-1; i>=0; i--) {
      if ( !this.bounds.withinBounds( pts.points[i] ) ) {
        count = i;
      }
    }

    if (count>=0) {
      pts.disconnect( pts.points.length-count );
    }
  }

  /**
   * Trim and create new split line
   */
  trim() {
    if (this.points.length >= this.maxPoints ) {
      var sp = new NoiseLine().to( this.clone().points );
      this.splitLines.push( sp );
      this.points = [];
    }
  }


  draw( f=this.form ) {
    super.draw(f);

    // track split lines
    var clear = this.splitLines.map( (sp, i) => {
      sp.draw( f );
      this._continuous( sp );
      this._checkBounds( sp );
      return (sp.points.length === 0) ? i : -1;
    });

    // clear empty split lines
    for (var i=0; i<clear.length; i++) {
      if (clear[i] >= 0) this.splitLines.splice( clear[i], 1);
    }
  }
}

