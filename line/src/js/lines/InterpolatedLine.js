class InterpolatedLine extends BaseLine {

  constructor(...args) {
    super( ...args );

    this.pointThreshold = 50;
    this.maxPoints = 200;

    this.steps = 5;
    this._counter = 0;
    this.direction = 1;

    this.color = this.colors.grey();
    this.color2 = this.colors.black();
  }

  down(x, y) {
    this.points = [ new Vector(x,y), new Vector(x,y), new Vector(x,y), new Vector(x,y)];
    this._counter = 0;
    this.tracing = !this.tracing;
  }


  draw( f=this.form ) {

    if (this.points.length < 4 || !this.points[0]) return;

    // increment counter, and flip direction when reached the end
    this._counter += this.direction;
    if (this._counter >= (this.points.length * this.steps) - 4 || this._counter <= 0) this.direction *= -1;

    // find current index based on counter
    var currentIndex = Math.max( 0, Math.min( this.points.length-1, Math.floor( this._counter / this.steps )) );

    // control points based on index
    var curve = new Curve().to( this.points );
    var ctrls = curve.controlPoints( currentIndex );

    // calculate t
    var t = (this._counter % this.steps) / this.steps;
    var ts = [t, t * t, t * t * t];

    // current interpolated position on the curve
    var pos = (ctrls) ? curve.catmullRomPoint( ts, ctrls ) : new Vector();

    // draw
    f.stroke( this.getColor() ).fill( false );
    f.curve( curve.catmullRom( 5 ), false );

    f.stroke( false ).fill( this.getColor("color2") );
    f.point( pos, 2, true );
  }
}