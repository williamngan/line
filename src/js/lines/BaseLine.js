class BaseLine extends Curve {

  constructor( ...args ) {
    super( ...args );

    this.canvasSize = new Vector();
    this.pressed = false; // mouse pressed
    this.form = null;
    this.maxPoints = 50;
    this.pointThreshold = 10;

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

  /**
   * Space's animate callback. Override in subclass for additional features and drawing styles.
   */
  animate( time, fps, context) {
    this.draw();
  }


  draw( f=this.form ) {
    f.stroke("rgba(0,0,0,.4)").fill(false);
    f.curve( this.catmullRom(5), false );
  }

  /**
   * Trim points array if max point is reached. Override in subclass for additional features.
   */
  trim() {
    if (this.points.length > this.maxPoints ) {
      this.disconnect( Math.floor(this.points.length/100) );
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
      if (this.pressed) this.drag( x, y );
    }
  }


  /**
   * When dragging. Override in subclass for additional features.
   */
  drag(x, y) {}


  /**
   * When pencil is down. Override in subclass for additional features.
   */
  down(x, y) {}


  /**
   * When pencil is up. Override in subclass for additional features.
   */
  up(x, y) {}


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
      this.pressed = false
    }
  }

}
