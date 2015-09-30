class ReflectLine extends NoiseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 20;
    this.splitLines = [];
    this.radian = 0;
    this.offset = 20;
  }

  onSpaceResize(w, h, evt) {

    this.splitLines = [];
    this.cutLines = [];

    var dw = w/10;
    var dw2 = dw/2;
    var dh = h/10;
    var dh2 = dh/2;

    this.offset = w/20;
    for (let i=0; i<10; i++) {
      this.cutLines.push( new Line(dw2+dw*i, 0).to(dw2+dw*i, h) );
      this.splitLines.push( new SmoothSpeedBrush() );
    }

    for (let i=0; i<10; i++) {
      this.cutLines.push( new Line(0, dh2+dh*i).to(w, dh2+dh*i) );
      this.splitLines.push( new SmoothSpeedBrush() );
    }
  }

  /**
   * Move the split lines
   * @param pts
   * @private
   */
  _continuous( cutline, index, form) {

    this.points.map( (p, i) => {
      this.splitLines[index].setAt( i, p.clone().reflect2D( cutline ) )
    });

    this.splitLines[index].draw( form );
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

    this.radian += Const.one_degree/5;
    var offset = this.offset * Math.sin( this.radian );

    super.draw(f);

    // track split lines
    this.cutLines.map( (cut, i) => {

      var c, di;
      if (i<10) {
        di = (i % Math.floor(this.cutLines.length/2))+1;
        c = new Line( cut.$add( offset * di, 0 ) ).to( cut.p1.$add( -offset * di, 0 ) );
      } else {
        di = ( (i-10) % Math.floor(this.cutLines.length/2))+1;
        c = new Line( cut.$add( 0, offset * di ) ).to( cut.p1.$add( 0, -offset * di ) );
      }
      f.stroke("#fff").line(c);

      this._continuous( c, i, f );
    });

  }
}

