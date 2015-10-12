class BaseLine extends Curve {

  constructor( ...args ) {
    super( ...args );

    this.canvasSize = new Vector();
    this.pressed = false; // mouse pressed
    this.form = null;

    this.maxPoints = 200;
    this.maxTracePoints = 30;

    this.pointThreshold = 10;
    this.distanceThreshold = 200*200;

    this.color = {
      dark: "#456",
      dark2: "rgba(68,85,102, .1)",
      light: "#f3f5f9",
      light2: "rgba(243,245,249, .1)"
    };

    this.tracing = false;
    this.counter = 0;

  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */
  init( space, maxPoints=false ) {
    this.canvasSize.set( space.size );
    this.form = new MovingLineForm(space);
    if (maxPoints) this.maxPoints = maxPoints;
    return this;
  }


  getColor() {
    if (!this.tracing) {
      return this.color.dark;
    } else {
      return (this.counter%2===0) ? this.color.dark2 : this.color.light2;
    }
  }

  /**
   * Space's animate callback. Override in subclass for additional features and drawing styles.
   */
  animate( time, fps, context) {
    this.counter++;
    this.draw();
  }

  trace( b ) {
    this.tracing = b;
  }


  draw( f=this.form ) {
    f.stroke( this.getColor() ).fill(false);
    f.curve( this.catmullRom(5), false );
  }

  /**
   * Trim points array if max point is reached. Override in subclass for additional features.
   */
  trim() {
    var m = (this.tracing) ? this.maxTracePoints : this.maxPoints;
    if (this.points.length > m ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }

  glue(mag) {
    if ( mag > this.distanceThreshold ) {

      if (mag > this.distanceThreshold * 3) {
        this.points = [ this.points.pop() ];
        return;
      }
      let p2 = this.points.pop();
      let p1 = this.points.pop();
      let lns = new Line( p1 ).to( p2 ).subpoints( Math.floor(this.distanceThreshold/5000) );

      this.to( lns );
    }
  }

  /**
   * When moving. Override in subclass for additional features.
   */
  move(x, y, z) {

    var last = new Vector(this.points[this.points.length-1]).$subtract( x, y ).magnitude(false);
    if (last > this.pointThreshold) {

      this.to( x, y );
      this.trim();
      this.glue( last );

      if (this.pressed) this.drag( x, y );
    }
  }


  /**
   * When dragging. Override in subclass for additional features.
   */
  drag(x, y) {
    this.tracing = true;
  }


  /**
   * When pencil is down. Override in subclass for additional features.
   */
  down(x, y) {
    this.points = [];
    this.tracing = !this.tracing;
  }


  /**
   * When pencil is up. Override in subclass for additional features.
   */
  up(x, y) {

  }


  /**
   * Space's bindMouse callback
   */
  onMouseAction( type, x, y, evt ) {

    // when mouse move, add a point to the trail
    if (type == "move") {
      this.move(x,y);
    }

    // check whether mouse is down
    if (type == "down") {
      this.pressed = true;
      this.down(x, y)
    } else if (type == "up") {
      this.pressed = false;
      this.up(x, y);
    } else if ( type == "out") {
      this.pressed = false;
    }
  }

}
