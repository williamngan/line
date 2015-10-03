class WalkSteps extends Rectangle {

  constructor( ...args ) {
    super( ...args );

    this.space = null;
    this.form = null;
    this.viewport = new Rectangle();

    this.steps = [];
    this.current = 0;

    this.height = 0;

  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */
  init( space, viewport, steps ) {
    this.space = space;
    this.form = new Form(space);
    this.viewport = viewport;

    if (Array.isArray(steps)) {
      this.steps = steps;
    }

  }

  getCurrentStep() {
    for (var i=0; i<this.steps.length; i++) {
      var r = this.steps[i];
      if (r.y < this.viewport.y && r.p1.y > this.viewport.y ) {
        this.current = i;
        return i;
      }
    }
    return -1;
  }

  getCurrentProgress( p ) {
    var curr = this.steps[ this.current ];
    var next = (this.current == this.steps.length-1) ? this.steps[this.steps.length-1].p1 : this.steps[this.current+1];
    console.log( p, curr.y);
    return (p-curr.y) / (next.y-curr.y);
  }

  /**
   * Space's animate callback. Override in subclass for additional features and drawing styles.
   */
  animate( time, fps, context) {
    this.form.fill("rgba(0,0,0,.2").stroke(false).rect( this );
    this.form.stroke("#06f").fill(false).rect(this.viewport);

    this.form.stroke("#f00");
    for (var s of this.steps ) {
      this.form.rect( s );
    }
  }


  /**
   * When moving. Override in subclass for additional features.
   */
  move(x, y, z) {
    var d = this.size().$subtract( this.viewport.size() ).$divide( space.size );
    var lastPos = this.clone();
    this.moveTo( this.x, -y*d.y);
    var diff = this.$subtract( lastPos );

    for (var s of this.steps ) {
      s.moveBy(0, diff.y);
    }

    console.log( "at", this.getCurrentStep() );
    console.log( "progress", this.getCurrentProgress(y) );
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
