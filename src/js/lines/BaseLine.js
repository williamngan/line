class BaseLine extends Curve {

  constructor( ...args ) {
    super( ...args );

    this.pressed = false; // mouse pressed
    this.form = null;
    this.maxPoints = 50;
  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */
  init( form, maxPoints = 50 ) {
    this.form = form;
    this.maxPoints = maxPoints;
  }

  /**
   * Space's animate callback. Override in subclass for additional features and drawing styles.
   */
  animate( time, fps, context) {
    this.form.stroke("rgba(0,0,0,.4)");
    this.form.curve( this.catmullRom(5) );
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
    this.to(x, y);
    this.trim();
    if (this.pressed) this.drag(x, y);
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
    } else if (type == "up" || type == "out") {
      this.pressed = false;
      this.up(x, y)
    }
  }

}
